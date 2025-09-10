import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionTagDto } from './dto/create-question_tag.dto';
import { UpdateQuestionTagDto } from './dto/update-question_tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionTag } from './entities/question_tag.entity';
import { Skill } from 'src/skill/entities/skill.entity';
import { DataSource, Repository } from 'typeorm';
import { Question } from 'src/question/entities/question.entity';
import { QuestionTagDto } from './dto/question_tag.dto';
import { BASE_CEFR, CEFR_TO_DIFFICULTY } from 'src/common/constant/skill.constant';

@Injectable()
export class QuestionTagsService {
  constructor(
    private readonly dataSrc: DataSource,
  ) {}
  create(createQuestionTagDto: CreateQuestionTagDto) {
    return 'This action adds a new questionTag';
  }

  findAll() {
    return `This action returns all questionTags`;
  }

  findOne(id: number) {
    return `This action returns a #${id} questionTag`;
  }

  update(id: number, updateQuestionTagDto: UpdateQuestionTagDto) {
    return `This action updates a #${id} questionTag`;
  }

  remove(id: number) {
    return `This action removes a #${id} questionTag`;
  }

  async addTagToQuestion(question: Question, skills: Skill[]): Promise<QuestionTag[]> {
    const tags = await this.ruleBasedTags(
      question.group?.part.partNumber,
      question.content,
    );

    const skillMap = new Map(skills.map((s) => [s.code, s]));

    return this.dataSrc.transaction(async (manager) => {
      const savedTags: QuestionTag[] = [];
      for (const tag of tags) {
        const skill = skillMap.get(tag.skill?.code ?? 'UNK');
        if (!skill) {
          throw new NotFoundException(
            `Skill with code ${tag?.skill?.code} not found`,
          );
        }

        const questionTag = manager.create(QuestionTag, {
          question,
          skill,
          confidence: tag.confidence,
          difficulty: tag.difficulty,
        });

        savedTags.push(await manager.save(questionTag));
      }
      return savedTags;
    });
  }

  async ruleBasedTags(
    partId: number,
    questionText: string,
    numPassages = 1,
  ): Promise<QuestionTagDto[]> {
    const tags: QuestionTagDto[] = [];
    const qLower = (questionText || '').toLowerCase().trim();

    const addTag = (code: string, confidence = 0.9) => {
      const cefr = BASE_CEFR[code] || 'B1';
      const difficulty = CEFR_TO_DIFFICULTY[cefr] || 0.5;
      tags.push({ skill: { code }, difficulty, confidence } as QuestionTagDto);
    };

    // --- Listening ---
    if (partId === 1) addTag('L1');
    else if (partId === 2) {
      if (
        /^(is|are|do|does|did|can|could|will|would|have|has|had|should|shall|may|might|won't|wouldn't|isn't|aren't|don't|doesn't)\b/.test(
          qLower,
        )
      )
        addTag('L2a');
      else if (/^(who|where|when|why|how|what|which)\b/.test(qLower))
        addTag('L2b');
      else if (qLower.includes(' or ')) addTag('L2c');
      else addTag('L2d');
    } else if (partId === 3) addTag('L3');
    else if (partId === 4) addTag('L4');
    // --- Reading ---
    else if (partId === 5) {
      addTag('R1');
      if (/\b(and|but|because|although|if|when|while)\b/.test(qLower))
        addTag('G1');
      else addTag('V1');
    } else if (partId === 6) {
      addTag('R2');
      addTag('G1');
      if (/\b(for example|however|therefore|in addition)\b/.test(qLower))
        addTag('C1');
    } else if (partId === 7) {
      if (numPassages === 1) addTag('R3');
      else addTag('R4');

      if (qLower.includes('according to') || qLower.includes('stated in'))
        addTag('Q1');
      else if (
        qLower.includes('implies') ||
        qLower.includes('infer') ||
        qLower.includes('suggests')
      )
        addTag('Q2');
      else if (
        qLower.includes('closest in meaning to') ||
        qLower.includes('refers to')
      )
        addTag('Q3');
      else if (
        qLower.includes('purpose') ||
        qLower.includes('mainly about') ||
        qLower.includes('intended')
      )
        addTag('Q4');
      else addTag('QX', 0.6);
    }

    if (tags.length === 0) addTag('UNK', 0.5);

    return tags;
  }
}
