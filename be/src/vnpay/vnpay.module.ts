// src/vnpay/vnpay.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VnpayService } from './vnpay.service';
import { VnpayController } from './vnpay.controller';
import { Order } from 'src/order/entities/order.entity';
import { Course } from 'src/courses/entities/course.entity';
import { UserCourse } from 'src/user_courses/entities/user_course.entity';
import { PlanModule } from 'src/plan/plan.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Course, UserCourse]), PlanModule],
  providers: [VnpayService],
  controllers: [VnpayController],
})
export class VnpayModule {}
