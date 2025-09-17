import { group } from 'console';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/group/entities/group.entity';
import { Part } from 'src/part/entities/part.entity';
import { QuestionTagsService } from 'src/question_tags/question_tags.service';
import { DataSource, Repository } from 'typeorm';

import { plainToInstance } from 'class-transformer';
import { Answer } from 'src/answers/entities/answer.entity';
import { Question } from 'src/question/entities/question.entity';
import { Skill } from 'src/skill/entities/skill.entity';
import { TestDto } from './dto/test.dto';
import { Test } from './entities/test.entity';
import { REVIEW_TEST_CONFIG } from './config/test.config';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(Test)
    private testRepo: Repository<Test>,

    @InjectRepository(Part)
    private partRepo: Repository<Part>,

    @InjectRepository(Group)
    private groupRepo: Repository<Group>,

    @InjectRepository(Question)
    private questionRepo: Repository<Question>,

    @InjectRepository(Skill)
    private skillsRepo: Repository<Skill>,

    @Inject()
    private readonly questionTagsService: QuestionTagsService,

    private dataSrc: DataSource,
  ) {}

  config_review_test = REVIEW_TEST_CONFIG;

  async create(dto: TestDto): Promise<TestDto> {
    const skills = await this.skillsRepo.find();
    return this.dataSrc.transaction(async (manager) => {
      // Tạo test
      const test = manager.create(Test, {
        title: dto.title,
        audioUrl: dto.audioUrl,
      });
      const savedTest = await manager.save(test);

      // Lưu parts, groups, questions, answers
      for (const p of dto.parts) {
        const part = manager.create(Part, {
          partNumber: p.partNumber,
          direction: p.direction,
          test: savedTest,
        });
        const savedPart = await manager.save(part);

        for (const g of p.groups) {
          const group = manager.create(Group, {
            orderIndex: g.orderIndex,
            paragraphEn: g.paragraphEn,
            paragraphVn: g.paragraphVn,
            imageUrl: g.imageUrl,
            audioUrl: g.audioUrl,
            part: savedPart,
          });
          const savedGroup = await manager.save(group);

          for (const q of g.questions) {
            const question = manager.create(Question, {
              numberLabel: q.numberLabel,
              content: q.content,
              explanation: q.explanation,
              // grammar_id: q.grammarId,
              group: savedGroup,
            });
            const savedQuestion = await manager.save(question);

            if (q.answers) {
              for (const a of q.answers) {
                const answer = manager.create(Answer, {
                  content: a.content,
                  isCorrect: a.isCorrect,
                  answerKey: a.answerKey,
                  question: savedQuestion,
                });
                await manager.save(answer);
              }
            }

            await this.questionTagsService.addTagToQuestion(
              savedQuestion,
              skills,
              manager, // truyền manager vào service
            );
          }
        }
      }

      // Load lại entity với quan hệ đầy đủ
      const fullTest = await manager.findOne(Test, {
        where: { id: savedTest.id },
        relations: {
          parts: {
            groups: {
              questions: {
                answers: true,
              },
            },
          },
        },
      });

      // Map entity → DTO tự động
      return plainToInstance(TestDto, fullTest, {
        excludeExtraneousValues: true,
      });
    });
  }

  async findAll() {
    const tests = await this.testRepo.find();
    return plainToInstance(TestDto, tests, {
      excludeExtraneousValues: true,
    });
  }

  async findOneById(id: string): Promise<TestDto> {
    const test = await this.testRepo.findOne({
      where: { id },
      relations: {
        parts: {
          groups: {
            questions: {
              answers: true,
            },
          },
        },
      },
    });
    if (!test) throw new NotFoundException('Test not found!');
    return plainToInstance(TestDto, test, { excludeExtraneousValues: true });
  }

  remove(id: number) {
    return `This action removes a #${id} test`;
  }

  async genReviewTest() {
    const config = this.config_review_test;

    return this.dataSrc.transaction(async (manager) => {
      const test = manager.create(Test, { title: config.title });
      const savedTest = await manager.save(test);

      let partOrder = 1;
      for (const p of config.parts) {
        const part = manager.create(Part, {
          partNumber: p.partNumber,
          test: savedTest,
        });
        const savedPart = await manager.save(part);

        let groupOrder = 1;
        for (const [skillCode, numGroups] of Object.entries(p.skills)) {
          const groups = await this.getGroupsBySkill(
            p.partNumber,
            skillCode,
            numGroups,
          );

          for (const g of groups) {
            const newGroup = manager.create(Group, {
              ...g,
              id: undefined,
              orderIndex: groupOrder++,
              part: savedPart,
            });
            await manager.save(newGroup);
          }
        }
        partOrder++;
      }

      const fullTest = await manager.findOne(Test, {
        where: { id: savedTest.id },
        relations: { parts: { groups: { questions: { answers: true } } } },
      });

      return plainToInstance(TestDto, fullTest, { excludeExtraneousValues: true });
    });
  }

  async getGroupsBySkill(partNumber: number, code: string, limit: number) {
    return this.groupRepo
      .createQueryBuilder('g')
      .innerJoinAndSelect('g.questions', 'q')
      .innerJoinAndSelect('q.answers', 'a')
      .leftJoin('g.part', 'p')
      .leftJoin('q.questionTags', 'qt')
      .leftJoin('qt.skill', 's')
      .where('p.partNumber = :partNumber', { partNumber })
      .andWhere('s.code = :code', { code })
      .orderBy('RANDOM()')
      .limit(limit)
      .getMany();
  }
}
