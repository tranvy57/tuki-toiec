import { PlanService } from './../plan/plan.service';
// src/vnpay/vnpay.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/order/entities/order.entity';
import { Repository } from 'typeorm';
import {
  buildVnpayUrl,
  formatDate,
  hmacSHA512,
  sortObject,
} from './utils/vnpay.util';
import { User } from 'src/user/entities/user.entity';
import { Course } from 'src/courses/entities/course.entity';
import {
  UserCourse,
  UserCourseStatus,
} from 'src/user_courses/entities/user_course.entity';
import { Plan } from 'src/plan/entities/plan.entity';

@Injectable()
export class VnpayService {
  private readonly secret = process.env.vnp_HashSecret!;

  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(UserCourse)
    private readonly userCourseRepo: Repository<UserCourse>,
    @Inject()
    private readonly planService: PlanService,
  ) {}
  async createPaymentUrl(
    code: string,
    amount: number,
    clientIp: string,
    courseId: string,
    user: User,
  ) {
    let order = await this.orderRepo.findOne({ where: { code } });
    let course = await this.courseRepo.findOne({ where: { id: courseId } });

    if (!order) {
      order = this.orderRepo.create({
        code,
        amount,
        status: 'pending',
        user: user,
        course: course!,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await this.orderRepo.save(order);
    } else if (order.status === 'paid') {
      throw new Error(`Order ${code} has already been paid.`);
    }

    const now = new Date();
    const params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: 'MCKEOKH1',
      vnp_Amount: amount * 100,
      vnp_CurrCode: 'VND',
      vnp_TxnRef: code,
      vnp_OrderInfo: `Thanh toan don hang ${code}`,
      vnp_OrderType: 'other',
      vnp_Locale: 'vn',
      vnp_IpAddr: clientIp,
      vnp_ReturnUrl: 'https://tukitoeic.app/payment/result',
      vnp_CreateDate: formatDate(new Date()),
      vnp_ExpireDate: formatDate(new Date(Date.now() + 15 * 60 * 1000)),
      vnp_BankCode: 'NCB',
    };

    const paymentUrl = buildVnpayUrl(
      params,
      process.env.vnp_HashSecret!,
      process.env.vnp_Url!,
    );

    console.log('VNPay payment URL:', paymentUrl);

    return paymentUrl;
  }

  verifyChecksum(allParams: Record<string, string>) {
    try {
      const { vnp_SecureHash, vnp_SecureHashType, ...rest } = allParams;
      const sorted = sortObject(rest);
      const signData = Object.entries(sorted)
        .map(([k, v]) => `${k}=${v}`)
        .join('&');
      const signed = hmacSHA512(this.secret, signData);

      console.log('VNPay verify >>>');
      console.log('signData:', signData);
      console.log('local:', signed);
      console.log('remote:', vnp_SecureHash);

      return (vnp_SecureHash || '').toLowerCase() === signed.toLowerCase();
    } catch (error) {
      console.error('Error verifying checksum:', error);
      return false;
    }
  }

  async confirmIpn(params: Record<string, string>) {
    try {
      const valid = this.verifyChecksum(params);
      if (!valid) return { RspCode: '97', Message: 'Invalid signature' };

      const code = params['vnp_TxnRef'];
      const rsp = params['vnp_ResponseCode'];
      const amountFromVNPay = Number(params['vnp_Amount'] || 0) / 100;

      const order = await this.orderRepo.findOne({ where: { code } });
      if (!order) return { RspCode: '01', Message: 'Order not found' };

      if (order.amount !== amountFromVNPay) {
        console.log(order);
        return { RspCode: '04', Message: 'Invalid amount' };
      }

      if (order.status === 'paid') {
        console.log(order);
        return { RspCode: '02', Message: 'Order already confirmed' };
      }

      if (rsp === '00') {
        order.status = 'paid';
        order.vnpTransactionNo = params['vnp_TransactionNo'];
        order.bankCode = params['vnp_BankCode'];
        order.vnpPayDate = params['vnp_PayDate'];
        console.log(order);
        await this.orderRepo.save(order);

        await this.createUserCourse(order);

        return { RspCode: '00', Message: 'Confirm Success' };
      } else {
        if (order.status === 'pending') {
          order.status = 'failed';
          console.log(order);
          await this.orderRepo.save(order);
        }
        console.log(order);

        return { RspCode: '00', Message: 'Confirm Failed' };
      }
    } catch (error) {
      console.error('Error confirming IPN:', error);
      return { RspCode: '99', Message: 'Internal error' };
    }
  }

  private async createUserCourse(order: Order): Promise<void> {
    try {
      const orderWithRelations = await this.orderRepo.findOne({
        where: { id: order.id },
        relations: ['user', 'course'],
      });

      if (!orderWithRelations?.user || !orderWithRelations?.course) {
        console.error('Order không có user hoặc course:', orderWithRelations);
        return;
      }

      const { user, course } = orderWithRelations;

      // Lấy tất cả user_course của user với course này
      const existingCourses = await this.userCourseRepo.find({
        where: {
          user: { id: user.id },
          course: { id: course.id },
        },
      });

      const trialCourse = existingCourses.find((uc) => uc.status === 'trial');
      const expiredCourse = existingCourses.find(
        (uc) => uc.status === UserCourseStatus.EXPIRED,
      );
      const activeCourse = existingCourses.find(
        (uc) => uc.status === UserCourseStatus.ACTIVE && uc.status === 'active',
      );

      // 🟢 Trường hợp 1: Đã có active → bỏ qua
      if (activeCourse) {
        console.log('⚠️ User đã có khóa học active, bỏ qua:', activeCourse.id);
        return;
      }

      // 🟠 Trường hợp 2: Có expired → kích hoạt lại
      if (expiredCourse) {
        console.log('♻️ User có course expired, cập nhật lại thành active');
        expiredCourse.status = UserCourseStatus.ACTIVE;
        expiredCourse.purchaseDate = new Date();
        expiredCourse.expireDate = new Date(
          Date.now() + (course.durationDays || 60) * 24 * 60 * 60 * 1000,
        );
        await this.userCourseRepo.save(expiredCourse);

        await this.planService.create(
          {
            courseId: course.id,
            targetScore: course.band,
          },
          user,
        );
        return;
      }

      // 🔵 Trường hợp 3: Có trial nhưng chưa có active → tạo mới
      if (trialCourse && !activeCourse) {
        console.log('✨ User có trial, tạo thêm khóa học active mới');
        const newActiveCourse = this.userCourseRepo.create({
          user,
          course,
          status: UserCourseStatus.ACTIVE,
          purchaseDate: new Date(),
          expireDate: new Date(
            Date.now() + (course.durationDays || 60) * 24 * 60 * 60 * 1000,
          ),
        });
        await this.userCourseRepo.save(newActiveCourse);

        await this.planService.create(
          {
            courseId: course.id,
            targetScore: course.band,
          },
          user,
        );
        return;
      }

      const userCourse = this.userCourseRepo.create({
        user,
        course,
        status: UserCourseStatus.ACTIVE,
        purchaseDate: new Date(),
        expireDate: new Date(
          Date.now() + (course.durationDays || 60) * 24 * 60 * 60 * 1000,
        ),
      });

      await this.userCourseRepo.save(userCourse);

      await this.planService.create(
        {
          courseId: course.id,
          targetScore: course.band,
        },
        user,
      );

      console.log('✅ Đã tạo user_course thành công:', {
        userId: user.id,
        courseId: course.id,
        orderId: order.id,
      });
    } catch (error) {
      console.error('❌ Lỗi khi tạo user_course:', error);
      // Không throw để không ảnh hưởng flow thanh toán
    }
  }
}
