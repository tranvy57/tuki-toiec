import { User } from 'src/user/entities/user.entity';

export class authResponse {
  token: string;
  user: User;
}
