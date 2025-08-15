import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Skill } from './skill.entity';

@Entity('user_skills')
export class UserSkill {
  @PrimaryColumn({ type: 'uuid' })
  user_id: string;

  @PrimaryColumn({ type: 'uuid' })
  skill_id: string;

  @Column({ type: 'smallint', default: 1 })
  proficiency: number; // 1-5 scale

  @Column({ type: 'smallint', nullable: true })
  years: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Skill, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'skill_id' })
  skill: Skill;
}