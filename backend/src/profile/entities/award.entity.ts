import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('awards')
export class Award extends BaseEntity {
  @Column({ type: 'uuid' })
  user_id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  issuer!: string;

  @Column({ type: 'date', nullable: true })
  date_received!: Date;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ nullable: true })
  url!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}