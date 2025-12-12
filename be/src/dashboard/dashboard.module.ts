import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Order } from 'src/order/entities/order.entity';
import { Attempt } from 'src/attempt/entities/attempt.entity';
import { UserCourse } from 'src/user_courses/entities/user_course.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Vocabulary } from 'src/vocabulary/entities/vocabulary.entity';
import { UserVocabulary } from 'src/user_vocabularies/entities/user_vocabulary.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Order,
            Attempt,
            UserCourse,
            Course,
            Vocabulary,
            UserVocabulary
        ])
    ],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule { }
