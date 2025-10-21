import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    // Inject any necessary repositories or services here
    private readonly orderRepo: Repository<Order>,
  ) {}
  create(createOrderDto: CreateOrderDto) {
    const order = this.orderRepo.create(createOrderDto);
    return this.orderRepo.save(order);
  }

  findAll() {
    return `This action returns all order`;
  }

  async findOne(id: string) {
    const order = await this.orderRepo.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
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
