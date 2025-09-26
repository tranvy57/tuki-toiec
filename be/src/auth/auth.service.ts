import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { authResponse } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userRepo.findOne({
      where: { username },
      relations: ['roles'],
    });
    if (!user) return null;

    const isMatch = await bcrypt.compare(pass, user.password);
    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any): Promise<authResponse> {
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles.map((r) => r.name),
    };
    return {
      token: this.jwtService.sign(payload),
      user,
    };
  }

  async introspect(token: string) {
    try {
      await this.jwtService.verifyAsync(token);
      return {
        valid: true,
      };
    } catch (error) {
      return { valid: false };
    }
  }
}
