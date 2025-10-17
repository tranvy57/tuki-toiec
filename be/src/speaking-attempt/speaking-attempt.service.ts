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
    question: string,
    transcript: string,
    avgConfidence: number,
    fluency: number,
  ) {
    const model = this.gemini.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
You are a TOEIC Speaking evaluator.

You will receive:
- The original reference sentence that the student was asked to read aloud.
- The student's transcribed speech (what the student actually said).
- Pronunciation confidence (0–1).
- Fluency score (0–5).

Evaluate the student's speaking performance on a 0–5 scale for:
- Grammar accuracy (does the student change or miss any grammatical structures)
- Vocabulary accuracy (are all words pronounced correctly and included)
- Task completion (how closely the student's speech matches the reference sentence)

Provide a short, specific feedback (2–3 sentences) that comments on pronunciation, fluency, and overall accuracy.

Return *only JSON* in this format:
{
  "grammar": number,
  "vocabulary": number,
  "task": number,
  "feedback": string
}

Reference sentence (what the student should have read): """${question}"""
Student response (what the student actually said): """${transcript}"""
Pronunciation confidence: ${avgConfidence.toFixed(2)}
Fluency score: ${fluency.toFixed(2)}
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      text = text.slice(jsonStart, jsonEnd + 1);
    }

    try {
      const parsed = JSON.parse(text);
      return {
        grammar: Number(parsed.grammar) || 0,
        vocabulary: Number(parsed.vocabulary) || 0,
        task: Number(parsed.task) || 0,
        feedback: parsed.feedback || '',
      };
    } catch (err) {
      console.error('❌ Gemini returned invalid JSON:', text);
      return {
        grammar: 0,
        vocabulary: 0,
        task: 0,
        feedback: 'Error parsing Gemini response.',
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

  async handleEvaluate(base64Audio: string, question: string, user: User) {
    const { gsUri, publicUrl } = await this.uploadToGCS(base64Audio);

    const { transcript, avgConfidence, fluency } =
      await this.transcribeAudio(gsUri);

    const geminiData = await this.evaluateSpeaking(
      question,
      transcript,
      avgConfidence,
      fluency,
    );

    const saved = await this.saveAttempt(user, {
      transcript,
      pronunciation: avgConfidence * 5,
      fluency,
      ...geminiData,
      audioUrl: publicUrl,
    });

    return {
      id: saved.id,
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
