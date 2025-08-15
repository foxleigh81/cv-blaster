import { Entity, Column, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('skills')
export class Skill extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToMany(() => User, { cascade: true })
  users: User[];
}