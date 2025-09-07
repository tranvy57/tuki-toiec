import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Part } from 'src/part/entities/part.entity';
import { Group } from 'src/group/entities/group.entity';

import { Answer } from 'src/answers/entities/answer.entity';
import { TestDto } from './dto/test.dto';
import { PartDto } from 'src/part/dto/part.dto';
import { GroupDto } from 'src/group/dto/group.dto';
import { plainToInstance } from 'class-transformer';
import { Question } from 'src/question/entities/question.entity';
import { Test } from './entities/test.entity';

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

    private dataSrc: DataSource,
  ) {}

  async create(dto: TestDto): Promise<TestDto> {
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
          directions: p.directions,
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
}
