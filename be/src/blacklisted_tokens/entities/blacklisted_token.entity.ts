import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('blacklisted_tokens')
export class BlacklistedToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  token: string;

  @Column({ type: 'bigint' })
  expiresAt: number;
}
