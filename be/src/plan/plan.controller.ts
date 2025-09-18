import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  create(@Body() createPlanDto: CreatePlanDto, @CurrentUser() user: User) {
    return this.planService.create(createPlanDto, user);
  }

  @Get()
  findAll() {
    return this.planService.findAll();
  }

  

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.planService.update(+id, updatePlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planService.remove(+id);
  }

  @Post('generate')
  planGenerator(@CurrentUser() user: User) {
    return this.planService.planGenerator(user.id);
  }
}
