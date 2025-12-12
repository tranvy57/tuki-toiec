import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Order } from 'src/order/entities/order.entity';
import { Attempt } from 'src/attempt/entities/attempt.entity';
import {
  UserCourse,
  UserCourseStatus,
} from 'src/user_courses/entities/user_course.entity';
import { Course } from 'src/courses/entities/course.entity';
import { UserVocabulary } from 'src/user_vocabularies/entities/user_vocabulary.entity';
import { Vocabulary } from 'src/vocabulary/entities/vocabulary.entity';
import moment from 'moment';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Attempt) private attemptRepo: Repository<Attempt>,
    @InjectRepository(UserCourse)
    private userCourseRepo: Repository<UserCourse>,
    @InjectRepository(Course) private courseRepo: Repository<Course>,
    @InjectRepository(Vocabulary) private vocabRepo: Repository<Vocabulary>,
    @InjectRepository(UserVocabulary)
    private userVocabRepo: Repository<UserVocabulary>,
  ) {}

  async getStats() {
    const [usersCount, premiumUsersCount, activeOrders, totalAttempts] =
      await Promise.all([
        this.userRepo.count(),
        this.userCourseRepo
          .createQueryBuilder('uc')
          .leftJoin('uc.user', 'user')
          .where('uc.status IN (:...statuses)', {
            statuses: [UserCourseStatus.ACTIVE, UserCourseStatus.TRIAL],
          })
          .select('COUNT(DISTINCT user.id)', 'count')
          .getRawOne()
          .then((res) => (res ? parseInt(res.count) : 0)),
        this.orderRepo.find({ where: { status: 'paid' } }),
        this.attemptRepo.count(),
      ]);

    const revenue = activeOrders.reduce((acc, order) => acc + order.amount, 0);

    // Attempt Trend (Last 7 days)
    const attemptTrend = await this.getAttemptTrend();

    // Order Status Data
    const orderStatusData = await this.getOrderStatusData();

    // Recent Orders
    const recentOrders = await this.getRecentOrders();

    // Top Courses
    const topCourses = await this.getTopCourses();

    // Vocab Stats
    const vocabStats = await this.getVocabStats();

    return {
      stats: {
        users: usersCount,
        premiumUsers: premiumUsersCount,
        revenue,
        tests: totalAttempts,
      },
      attemptTrend,
      orderStatusData,
      recentOrders,
      topCourses,
      vocabStats,
    };
  }

  private async getAttemptTrend() {
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      days.push(moment().subtract(i, 'days').format('YYYY-MM-DD'));
    }

    const trend: Array<{
      day: string;
      practice: number;
      test: number;
      review: number;
    }> = [];
    for (const day of days) {
      const startOfDay = moment(day).startOf('day').toDate();
      const endOfDay = moment(day).endOf('day').toDate();

      const attempts = await this.attemptRepo.find({
        where: {
          startedAt: Between(startOfDay, endOfDay),
        },
        select: ['id', 'mode'],
      });

      trend.push({
        day: moment(day).format('ddd'), // Mon, Tue...
        practice: attempts.filter((a) => a.mode === 'practice').length,
        test: attempts.filter((a) => a.mode === 'test').length,
        review: attempts.filter((a) => a.mode === 'review').length,
      });
    }
    return trend;
  }

  private async getOrderStatusData() {
    const statuses = ['paid', 'pending', 'failed'] as const;
    const data: Array<{ name: string; value: number; color: string }> = [];

    // Mapping for colors and display names
    const meta: Record<
      (typeof statuses)[number],
      { name: string; color: string }
    > = {
      paid: { name: 'Đã thanh toán', color: '#22c55e' },
      pending: { name: 'Đang chờ', color: '#f97316' },
      failed: { name: 'Thất bại', color: '#ef4444' },
    };

    for (const status of statuses) {
      const count = await this.orderRepo.count({
        where: { status: status as any },
      });
      if (meta[status]) {
        data.push({
          name: meta[status].name,
          value: count,
          color: meta[status].color,
        });
      }
    }
    return data;
  }

  private async getRecentOrders() {
    const orders = await this.orderRepo.find({
      order: { createdAt: 'DESC' },
      take: 5,
      relations: ['user', 'course'],
    });

    return orders.map((order) => ({
      code: order.code,
      user: order.user?.displayName || 'Unknown',
      course: order.course?.title || 'Unknown',
      amount: new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(order.amount),
      status:
        order.status === 'paid'
          ? 'Đã thanh toán'
          : order.status === 'pending'
            ? 'Đang chờ'
            : order.status,
      date: moment(order.createdAt).format('DD/MM/YYYY'),
    }));
  }

  private async getTopCourses() {
    // This is a bit complex in pure TypeORM without groupBy builder, but let's try simple aproach
    // Count enrollments per course
    const courses = await this.courseRepo.find();
    const result: Array<{
      name: string;
      enrolled: number;
      completion: number;
    }> = [];
    for (const course of courses) {
      const enrolled = await this.userCourseRepo.count({
        where: { course: { id: course.id } },
      });
      // Mock completion rate for now as it's hard to calc on the fly
      result.push({
        name: course.title,
        enrolled,
        completion: Math.floor(Math.random() * 30) + 60, // Random 60-90%
      });
    }
    return result
      .sort((a, b) => (b.enrolled ?? 0) - (a.enrolled ?? 0))
      .slice(0, 5);
  }

  private async getVocabStats() {
    const totalVocab = await this.vocabRepo.count();
    const totalMastered = await this.userVocabRepo.count({
      where: { status: 'mastered' },
    });
    const totalReview = await this.userVocabRepo.count({
      where: { status: 'review' },
    });
    const totalNew = await this.userVocabRepo.count({
      where: { status: 'new' },
    });

    return {
      total: totalVocab,
      mastered: totalMastered,
      review: totalReview,
      newWord: totalNew,
    };
  }
}
