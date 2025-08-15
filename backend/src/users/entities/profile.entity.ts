import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from './user.entity';

@Entity('profiles')
export class Profile extends BaseEntity {
  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true, length: 50 })
  phone: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  linkedin: string;

  @Column({ nullable: true })
  github: string;

  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}