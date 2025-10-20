// src/vnpay/vnpay.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VnpayService } from './vnpay.service';
import { VnpayController } from './vnpay.controller';
import { Order } from 'src/order/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [VnpayService],
  controllers: [VnpayController],
})
export class VnpayModule {}
