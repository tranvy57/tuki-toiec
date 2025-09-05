import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { config } from 'process';
import { ConfigService } from '@nestjs/config';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    console.log('payload.sub', payload.sub);

    const user = await this.userRepo.find({ where: { id: payload.sub } });

    console.log('user login', user);

    if (!user) throw new UnauthorizedException();
    return user;
  }
}
