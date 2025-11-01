import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpeakingAttempt } from './entities/speaking-attempt.entity';
import { User } from 'src/user/entities/user.entity';
import { Storage } from '@google-cloud/storage';
import speech from '@google-cloud/speech';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  average,
  calcConfidence,
  calcFluency,
} from 'src/common/utils/speaking';
import { GcsService } from 'src/gcs/gcs.service';
import path from 'path';
import { computeOverall, normalizeFluency, normalizePronunciation } from './utils/scoring';

@Injectable()
export class SpeakingAttemptService {
  private readonly speechClient = new speech.SpeechClient();
  private readonly gemini = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY || '',
  );

  constructor(
    @InjectRepository(SpeakingAttempt)
    private readonly speakingAttemptRepository: Repository<SpeakingAttempt>,
    private readonly gcsService: GcsService,
  ) {
    this.speechClient = new speech.SpeechClient({
      keyFilename: path.resolve(
        process.env.GOOGLE_APPLICATION_CREDENTIALS || '',
      ),
      projectId: process.env.GCS_PROJECT_ID,
    });
  }

  async uploadToGCS(base64Audio: string): Promise<any> {
    const buffer = Buffer.from(base64Audio, 'base64');
    const destination = `audio-files/speaking-${Date.now()}.mp3`;

    const { publicUrl, gsUri } = await this.gcsService.uploadBuffer(
      buffer,
      destination,
    );

    return { gsUri, publicUrl };
  }

  async transcribeAudio(gcsUri: string) {
    const [operation] = await this.speechClient.longRunningRecognize({
      config: {
        encoding: 'MP3',
        sampleRateHertz: 44100,
        languageCode: 'en-US',
        model: 'latest_long',
        enableWordConfidence: true,
        enableWordTimeOffsets: true,
        enableAutomaticPunctuation: true,
      },
      audio: { uri: gcsUri },
    });

    const [response] = await operation.promise();

    if (!response.results) {
      throw new Error('Transcription failed');
    }
    const transcript = response.results
      .map((r) => r.alternatives?.[0]?.transcript ?? '')
      .join(' ');
    const words = response.results.flatMap(
      (r) => r.alternatives?.[0]?.words ?? [],
    );
    const avgConfidence = calcConfidence(words);
    const fluency = calcFluency(words);

    return { transcript, avgConfidence, fluency };
  }

  async evaluateSpeaking(
    type: string,
    context: string,
    prompt: string, 
    transcript: string,
    avgConfidence: number,
    fluency: number,
  ) {
    const model = this.gemini.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const promptReadAloud = `
You are a certified TOEIC Speaking evaluator for the "Read Aloud" task.

You will receive:
- context: the sentence or text the student was asked to read aloud
- response: the student's transcribed speech
- pronunciation_confidence: 0–1
- fluency_score: 0–5

Evaluate how accurately and clearly the student read the given text aloud.
When comparing context and response, ignore case and punctuation. Penalize omissions, insertions, or substitutions.
Do NOT score pronunciation or fluency as categories; they are provided only for feedback phrasing.

Score each category from 0–5 (integers only):
- grammar: grammatical accuracy and whether any words or structures were changed
- vocabulary: accuracy and completeness of words (misread/missing words lower the score)
- task: how closely the student's speech matches the reference text

Give concise feedback (2–3 sentences) focusing on pronunciation clarity, fluency, and overall accuracy.

Output rules:
- Return ONLY valid minified JSON (no code fences, no comments)
- Use integers from 0 to 5 for all scores
- Keys: "type", "context", "grammar", "vocabulary", "task", "feedback"

{
  "type": "read_aloud",
  "context": "${context.replaceAll('"', '\\"')}",
  "grammar": 0,
  "vocabulary": 0,
  "task": 0,
  "feedback": ""
}

context: """${context}"""
response: """${transcript}"""
pronunciation_confidence: ${avgConfidence.toFixed(2)}
fluency_score: ${fluency.toFixed(2)}
`.trim();

    const promptGeneral = `
You are a certified TOEIC Speaking evaluator.

You will receive:
- type: the task type (e.g., "Describe a Picture", "Respond to Questions", "Express an Opinion")
- context: background information (if any)
- prompt: the question or instruction to answer
- response: the student's transcribed speech
- pronunciation_confidence: 0–1
- fluency_score: 0–5

Evaluate using ETS criteria. Base "task" on relevance, completeness, and alignment with the prompt and context.
Do NOT score pronunciation or fluency as categories; they are provided only for feedback phrasing.

Score each category from 0–5 (integers only):
- grammar: grammatical accuracy and sentence structure
- vocabulary: lexical range and appropriacy
- task: task fulfillment (relevance, completeness, alignment)

Give concise feedback (2–3 sentences) addressing pronunciation, fluency, and communicative clarity.

Output rules:
- Return ONLY valid minified JSON (no code fences, no comments)
- Use integers from 0 to 5 for all scores
- Keys: "type", "context", "grammar", "vocabulary", "task", "feedback"

{
  "type": "${type}",
  "context": "${context.replaceAll('"', '\\"')}",
  "grammar": 0,
  "vocabulary": 0,
  "task": 0,
  "feedback": ""
}

type: "${type}"
context: """${context}"""
prompt: """${prompt}"""
response: """${transcript}"""
pronunciation_confidence: ${avgConfidence.toFixed(2)}
fluency_score: ${fluency.toFixed(2)}
`.trim();

    const fullPrompt =
      type?.toLowerCase() === 'read_aloud' 
        ? promptReadAloud
        : promptGeneral;

    const result = await model.generateContent(fullPrompt);
    let text = result.response.text().trim();

    // Robust JSON extraction
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      text = text.slice(jsonStart, jsonEnd + 1);
    }

    try {
      const parsed = JSON.parse(text);
      // Ép kiểu + cắt ngưỡng 0–5 (integer)
      const toInt05 = (x: any) => {
        const n = Math.round(Number(x) || 0);
        return Math.max(0, Math.min(5, n));
      };
      return {
        grammar: toInt05(parsed.grammar),
        vocabulary: toInt05(parsed.vocabulary),
        task: toInt05(parsed.task),
        feedback: typeof parsed.feedback === 'string' ? parsed.feedback : '',
      };
    } catch (err) {
      console.error('❌ Gemini returned invalid JSON:', text);
      return {
        grammar: 0,
        vocabulary: 0,
        task: 0,
        feedback: 'Error parsing evaluation output.',
      };
    }
  }

  async saveAttempt(user: User, data: any) {
    const attempt = this.speakingAttemptRepository.create({
      user,
      transcript: data.transcript,
      pronunciation: data.pronunciation,
      fluency: data.fluency,
      grammar: data.grammar,
      vocabulary: data.vocabulary,
      task: data.task,
      overall: average([
        data.pronunciation,
        data.fluency,
        data.grammar,
        data.vocabulary,
        data.task,
      ]),
      audioUrl: data.audioUrl,
    });

    return await this.speakingAttemptRepository.save(attempt);
  }

  async handleEvaluate(
    base64Audio: string,
    type: string,
    context: string,
    prompt: string,
    user: User,
  ) {
    const { gsUri, publicUrl } = await this.uploadToGCS(base64Audio);

    const { transcript, avgConfidence, fluency } =
      await this.transcribeAudio(gsUri);

    const geminiData = await this.evaluateSpeaking(
      type,
      context,
      prompt,
      transcript,
      avgConfidence,
      fluency,
    );

    const pronunciation = normalizePronunciation(avgConfidence);
    const fluencyScore = normalizeFluency(fluency);

    // ✅ Overall theo trọng số type
    const overall = computeOverall(
      type,
      pronunciation,
      fluencyScore,
      geminiData.grammar,
      geminiData.vocabulary,
      geminiData.task,
    );

    const saved = await this.saveAttempt(user, {
      type,
      context,
      transcript,
      pronunciation, // 0–5
      fluency: fluencyScore, // 0–5
      grammar: geminiData.grammar,
      vocabulary: geminiData.vocabulary,
      task: geminiData.task,
      overall, // 0–5
      audioUrl: publicUrl,
      feedback: geminiData.feedback,
    });

    return {
      id: saved.id,
      type,
      context,
      transcript,
      pronunciation: saved.pronunciation,
      fluency: saved.fluency,
      grammar: saved.grammar,
      vocabulary: saved.vocabulary,
      task: saved.task,
      overall: saved.overall,
      audioUrl: saved.audioUrl,
      feedback: geminiData.feedback,
    };
  }
}
