import { Injectable } from '@nestjs/common';
import { UpdateAttemptAnswerDto } from './dto/update-attempt_answer.dto';
import { CreateAttemptAnswerDto } from './dto/create-attempt_answer.dto';

@Injectable()
export class AttemptAnswersService {
  create(createAttemptAnswerDto: CreateAttemptAnswerDto) {
    return 'This action adds a new attemptAnswer';
  }

  findAll() {
    return `This action returns all attemptAnswers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attemptAnswer`;
  }

  update(id: number, updateAttemptAnswerDto: UpdateAttemptAnswerDto) {
    return `This action updates a #${id} attemptAnswer`;
  }

  remove(id: number) {
    return `This action removes a #${id} attemptAnswer`;
  }
}
