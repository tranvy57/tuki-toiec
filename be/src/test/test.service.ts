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
import { QuestionTag } from 'src/question_tags/entities/question_tag.entity';

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

    @InjectRepository(QuestionTag)
    private questionTagRepo: Repository<QuestionTag>,

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

            // await this.questionTagsService.addTagToQuestion(
            //   savedQuestion,
            //   skills,
            //   manager, // truyền manager vào service
            // );
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
          skills: true,
        },
      },
      order: {
        parts: {
          partNumber: 'ASC',
          groups: { orderIndex: 'ASC' },
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

      return plainToInstance(TestDto, fullTest, {
        excludeExtraneousValues: true,
      });
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

  async genReviewTestv2() {
    // target = số group mỗi part
    const groupDistribution = { 1: 2, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 2 };

    const parts = await this.partRepo.find({
      where: { isActive: true },
      relations: ['skills'],
    });

    return this.dataSrc.transaction(async (manager) => {
      const test = await manager.save(
        manager.create(Test, { title: 'TOEIC Review Test – Group Based' }),
      );

      let globalQuestionNumber = 1;

      // Lặp qua từng part
      for (const part of parts) {
        const numGroupsTarget = groupDistribution[part.partNumber] || 0;
        if (!numGroupsTarget) continue;

        const savedPart = await manager.save(
          manager.create(Part, {
            partNumber: part.partNumber,
            direction: part.direction,
            test,
          }),
        );

        let groupCount = 0;
        let groupOrder = 1;

        // Lấy toàn bộ group gốc của part này
        const groupsAll = await this.groupRepo.find({
          where: { part: { partNumber: part.partNumber } },
          relations: [
            'questions',
            'questions.answers',
            'questions.questionTags',
            'questions.questionTags.skill',
          ],
        });

        // Shuffle & chọn group ngẫu nhiên theo skill (nếu muốn)
        const shuffled = groupsAll.sort(() => Math.random() - 0.5);

        // ✅ Lặp group và clone đủ số lượng target
        for (const g of shuffled) {
          if (groupCount >= numGroupsTarget) break;

          const savedGroup = await manager.save(
            manager.create(Group, {
              orderIndex: groupOrder++,
              part: savedPart,
              paragraphEn: g.paragraphEn,
              paragraphVn: g.paragraphVn,
              imageUrl: g.imageUrl,
              audioUrl: g.audioUrl,
            }),
          );

          // ✅ Clone toàn bộ question trong group (không cắt lẻ)
          for (const q of g.questions) {
            const savedQ = await manager.save(
              manager.create(Question, {
                group: savedGroup,
                numberLabel: globalQuestionNumber++,
                content: q.content,
                explanation: q.explanation,
                score: q.score,
                sourceQuestionId: q.id,
              }),
            );

            // Clone answers
            for (const a of q.answers) {
              await manager.save(
                manager.create(Answer, {
                  question: savedQ,
                  content: a.content,
                  isCorrect: a.isCorrect,
                  answerKey: a.answerKey,
                  sourceAnswerId: a.id,
                }),
              );
            }

            // Clone tags (skills)
            const tags = await this.questionTagRepo.find({
              where: { question: { id: q.id } },
              relations: ['skill'],
            });

            for (const t of tags) {
              await manager.save(
                manager.create(QuestionTag, {
                  question: savedQ,
                  skill: t.skill,
                  difficulty: t.difficulty,
                  confidence: t.confidence,
                }),
              );
            }
          }

          groupCount++;
        }
      }

      // Load lại test đầy đủ
      const fullTest = await manager.findOne(Test, {
        where: { id: test.id },
        relations: {
          parts: { groups: { questions: { answers: true } } },
        },
      });

      return plainToInstance(TestDto, fullTest, {
        excludeExtraneousValues: true,
      });
    });
  }
}
