import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginRequestDto } from './dto/login-request.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepo.findOne({
      where: { username },
      select: ['id', 'username', 'password'],
    });

    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const { password: _, ...result } = user;
    return result;
  }

  async login(request: LoginRequestDto): Promise<{ access_token: string }> {
    
    const payload = { username: request.username, role: request.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
    };
  }
}
