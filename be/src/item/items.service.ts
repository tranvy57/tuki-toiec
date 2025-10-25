import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetItemsDto } from './dto/get-item.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepo: Repository<Item>,
  ) {}
  create(createItemDto: CreateItemDto) {
    return 'This action adds a new item';
  }

  async findAll(query: GetItemsDto) {
    const { modality, difficulty, limit, offset, skill_type } = query;

    console.log(query)

    const qb = this.itemsRepo
      .createQueryBuilder('item')
      .where('item.status = :status', { status: 'active' })
      .andWhere('item.is_active = true')
      .orderBy('item.created_at', 'DESC')
      .take(limit)
      .skip(offset);

    if (modality) qb.andWhere('item.modality = :modality', { modality });
    if (difficulty)
      qb.andWhere('item.difficulty = :difficulty', { difficulty });
    if (skill_type)
      qb.andWhere('item.skill_type = :skill_type', { skill_type });

    const [data, total] = await qb.getManyAndCount();

    return {
      total,
      count: data.length,
      offset,
      limit,
      items: data.map((item) => ({
        id: item.id,
        modality: item.modality,
        difficulty: item.difficulty,
        bandHint: item.bandHint,
        promptJsonb: item.promptJsonb,
        solutionJsonb: item.solutionJsonb,
        rubricJsonb: item.rubricJsonb,
      })),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
