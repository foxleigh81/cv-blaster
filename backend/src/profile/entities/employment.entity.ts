import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { EmploymentAchievement } from '../../types';

@Entity('employment_history')
export class Employment extends BaseEntity {
  @Column({ type: 'uuid' })
  user_id!: string;

  @Column()
  company!: string;

  @Column()
  position!: string;

  @Column({ type: 'date' })
  start_date!: Date;

  @Column({ type: 'date', nullable: true })
  end_date!: Date | null;

  @Column({ default: false })
  current!: boolean;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  achievements!: EmploymentAchievement[] | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
