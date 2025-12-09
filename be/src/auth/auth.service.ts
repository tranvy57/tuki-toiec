import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { authResponse } from './dto/auth-response.dto';
import { BlacklistedToken } from 'src/blacklisted_tokens/entities/blacklisted_token.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    @InjectRepository(BlacklistedToken)
    private readonly blacklistedRepo: Repository<BlacklistedToken>,
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

  async logout(token: string) {
    try {
      const decoded: any = this.jwtService.decode(token);
      if (!decoded || !decoded.exp) return { success: false };

      const expiresAt = decoded.exp;

      const blacklisted = this.blacklistedRepo.create({ token, expiresAt });
      await this.blacklistedRepo.save(blacklisted);

      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  async introspect(token: string) {
    // Kiểm tra xem token có bị blacklist chưa
    const blacklisted = await this.blacklistedRepo.findOne({
      where: { token },
    });
    if (blacklisted) return { valid: false };

    try {
      await this.jwtService.verifyAsync(token);
      return { valid: true };
    } catch {
      return { valid: false };
    }
  }
}
