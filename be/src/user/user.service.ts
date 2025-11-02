import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/role/entities/role.entity';
import { Vocabulary } from 'src/vocabulary/entities/vocabulary.entity';
import { UserVocabulary } from 'src/user_vocabularies/entities/user_vocabulary.entity';
import { UserVocabularyDto } from 'src/user_vocabularies/dto/user-vocabulary.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Vocabulary)
    private readonly vocabRepository: Repository<Vocabulary>,
    @InjectRepository(UserVocabulary)
    private readonly userVocabRepository: Repository<UserVocabulary>,
  ) {}

  private toResponseDto(user: User): UserResponseDto {
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  private toVocabDto(uVocab: UserVocabulary): UserVocabularyDto {
    return plainToInstance(UserVocabularyDto, uVocab, {
      excludeExtraneousValues: true,
    });
  }

  private toVocabDtoList(uVocabs: UserVocabulary[]): UserVocabularyDto[] {
    return plainToInstance(UserVocabularyDto, uVocabs, {
      excludeExtraneousValues: true,
    });
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existed = await this.userRepository.exist({
      where: { email: createUserDto.email },
    });
    if (existed) throw new ConflictException('Email đã tồn tại');

    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    const defaultRole = await this.roleRepository.findOne({
      where: { name: 'user' },
    });
    if (!defaultRole) {
      throw new Error(
        'Default role "user" not found in database. Seed it first!',
      );
    }

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      roles: [defaultRole],
    });

    const savedUser = await this.userRepository.save(user);

    return this.toResponseDto(savedUser);
  }

  async saveUserVocab(id: string, user: User) {
    const vocabulary = await this.vocabRepository.findOne({
      where: { id: id },
    });
    if (!vocabulary) {
      throw new NotFoundException('Vocabulary not found!');
    }

    const userVocab = await this.userVocabRepository.findOne({
      where: {
        vocabulary: {
          id: id,
        },
      },
    });

    console.log('vocab find', userVocab);

    if (!userVocab) {
      const newUserVocab = this.userVocabRepository.create({
        user,
        vocabulary,
        wrongCount: 0,
        correctCount: 0,
      });
      const saved = await this.userVocabRepository.save(newUserVocab);
      console.log('saved', saved);

      return this.toVocabDto(saved);
    } else throw new BadRequestException('this word is already saved!');
  }

  async getListUserVocab(user: User) {
    const uVocabList = await this.userVocabRepository.find({
      where: { user: { id: user.id } },
      relations: { vocabulary: true },
      order: {
        updatedAt: 'DESC',
      }
    });

    return uVocabList.map(({ vocabulary, ...rest }) => ({
      ...rest,
      vocabularyId: vocabulary?.id,
      ...vocabulary,
    }));
  }

  async deleteUserVocab(user: User, id: string) {
    const uVocab = await this.userVocabRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
        vocabulary: {
          id: id,
        },
      },
    });

    if (!uVocab) {
      throw new NotFoundException('User Vocab not found!');
    }
    await this.userVocabRepository.remove(uVocab);
    return;
  }

  async updateMe(user: User, dto: UpdateUserDto) {
    const { email, displayName } = dto;

    if (email && email !== user.email) {
      const emailExisted = await this.userRepository.exist({
        where: { email: email },
      });
      if (emailExisted) throw new ConflictException('Email đã tồn tại');
      user.email = email;
    }
    if (displayName && displayName !== user.displayName) {
      user.displayName = displayName;
    }
    await this.userRepository.save(user);
    return this.toResponseDto(user);
  }

  async getMe(user: User) {
    const found = await this.userRepository.findOne({
      where: { id: user.id },
      relations: {
        roles: true,
      },
    });

    if (!found) throw new NotFoundException('User not found');
    return this.toResponseDto(found);
  }
}
