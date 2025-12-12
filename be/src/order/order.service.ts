import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrderService {
  constructor(
    // Inject any necessary repositories or services here
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}
  create(createOrderDto: CreateOrderDto) {
    const order = this.orderRepo.create(createOrderDto);
    return this.orderRepo.save(order);
  }

  findAll() {
    return this.orderRepo.find({
      relations: ['user', 'course'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(code: string) {
    const order = await this.orderRepo.findOne({
      where: { code },
      relations: ['user', 'course'],
    });

    if (!order) {
      throw new NotFoundException(`Order with code ${code} not found`);
    }

    return order;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
