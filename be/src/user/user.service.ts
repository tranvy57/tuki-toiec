import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/role/entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  private toResponseDto(user: User): UserResponseDto {
    return plainToInstance(UserResponseDto, user, {
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
}
