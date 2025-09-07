import { Injectable } from '@nestjs/common';
import { CreateUserVocabularyDto } from './dto/create-user_vocabulary.dto';
import { UpdateUserVocabularyDto } from './dto/update-user_vocabulary.dto';

@Injectable()
export class UserVocabulariesService {
  create(createUserVocabularyDto: CreateUserVocabularyDto) {
    return 'This action adds a new userVocabulary';
  }

  findAll() {
    return `This action returns all userVocabularies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userVocabulary`;
  }

  update(id: number, updateUserVocabularyDto: UpdateUserVocabularyDto) {
    return `This action updates a #${id} userVocabulary`;
  }

  remove(id: number) {
    return `This action removes a #${id} userVocabulary`;
  }
}
