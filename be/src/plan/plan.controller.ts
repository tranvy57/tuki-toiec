import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  create(@Body() createPlanDto: CreatePlanDto, @CurrentUser() user: User) {
    return this.planService.create(createPlanDto, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() status: 'new' | 'in_progress' | 'completed' | 'paused',
    @CurrentUser() user: User,
  ) {
    return this.planService.updatePlan(id, status);
  }

  // @Get()
  // findUserPlans(@CurrentUser() user: User, @Query('course') courseId?: string) {
  //   return this.planService.findUserPlans(user, courseId);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string, @CurrentUser() user: User) {
  //   return this.planService.findOne(id, user);
  // }

  // @Patch(':id/progress')
  // updateProgress(
  //   @Param('id') id: string,
  //   @Body() updateDto: { lessonId?: string; taskId?: string },
  //   @CurrentUser() user: User,
  // ) {
  //   return this.planService.updateProgress(id, updateDto, user);
  // }

  // @Get(':id/summary')
  // getPlanSummary(@Param('id') id: string, @CurrentUser() user: User) {
  //   return this.planService.getPlanSummary(id, user);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updatePlanDto: UpdatePlanDto,
  //   @CurrentUser() user: User,
  // ) {
  //   return this.planService.update(id, updatePlanDto, user);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string, @CurrentUser() user: User) {
  //   return this.planService.remove(id, user);
  // }

  @Get('my-plan')
  async getPlan(@CurrentUser() user: User) {
    return this.planService.getMyPlan(user);
  }
}
