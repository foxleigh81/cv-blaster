import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('education')
export class Education extends BaseEntity {
  @Column({ type: 'uuid' })
  user_id!: string;

  @Column()
  institution!: string;

  @Column()
  degree!: string;

  @Column({ nullable: true })
  field!: string;

  @Column({ type: 'date', nullable: true })
  graduation_date!: Date;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  gpa!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}