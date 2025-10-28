import { Injectable } from '@nestjs/common';
import { CreateUserVocabularySessionDto } from './dto/create-user_vocabulary_session.dto';
import { UpdateUserVocabularySessionDto } from './dto/update-user_vocabulary_session.dto';

@Injectable()
export class UserVocabularySessionService {
  create(createUserVocabularySessionDto: CreateUserVocabularySessionDto) {
    return 'This action adds a new userVocabularySession';
  }

  findAll() {
    return `This action returns all userVocabularySession`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userVocabularySession`;
  }

  update(id: number, updateUserVocabularySessionDto: UpdateUserVocabularySessionDto) {
    return `This action updates a #${id} userVocabularySession`;
  }

  remove(id: number) {
    return `This action removes a #${id} userVocabularySession`;
  }
}
