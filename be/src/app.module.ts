import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigServiceModule } from './config/config-service.module';
import { DatabaseConfigModule } from './config/database.config.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { PermissionsGuard } from './auth/guard/permission.guard';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { VocabularyModule } from './vocabulary/vocabulary.module';
import { TestModule } from './test/test.module';
import { AttemptModule } from './attempt/attempt.module';
import { PartModule } from './part/part.module';
import { GroupModule } from './group/group.module';
import { QuestionModule } from './question/question.module';
import { AnswersModule } from './answers/answers.module';
import { GrammarModule } from './grammar/grammar.module';
import { AttemptAnswersModule } from './attempt_answers/attempt_answers.module';
import { PlanModule } from './plan/plan.module';
import { PhaseModule } from './phase/phase.module';
import { PhaseLessonsModule } from './phase_lessons/phase_lessons.module';
import { LessonModule } from './lesson/lesson.module';
import { StudyTasksModule } from './study_tasks/study_tasks.module';
import { LessonDepedenciesModule } from './lesson_depedencies/lesson_depedencies.module';
import { UnitModule } from './unit/unit.module';
import { TargetSkillsModule } from './target_skills/target_skills.module';
import { SkillModule } from './skill/skill.module';
import { UserProgressModule } from './user_progress/user_progress.module';
import { SeedService } from './seeder/seed.service';

@Module({
  imports: [
    ConfigServiceModule,
    DatabaseConfigModule,
    UserModule,
    AuthModule,
    RoleModule,
    PermissionModule,
    VocabularyModule,
    TestModule,
    AttemptModule,
    PartModule,
    GroupModule,
    QuestionModule,
    AnswersModule,
    GrammarModule,
    AttemptAnswersModule,
    PlanModule,
    PhaseModule,
    PhaseLessonsModule,
    LessonModule,
    StudyTasksModule,
    LessonDepedenciesModule,
    UnitModule,
    TargetSkillsModule,
    SkillModule,
    UserProgressModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SeedService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
