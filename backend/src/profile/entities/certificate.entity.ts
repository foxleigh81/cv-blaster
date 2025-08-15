import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('certificates')
export class Certificate extends BaseEntity {
  @Column({ type: 'uuid' })
  user_id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  issuer!: string;

  @Column({ type: 'date', nullable: true })
  issue_date!: Date;

  @Column({ type: 'date', nullable: true })
  expiry_date!: Date;

  @Column({ nullable: true })
  credential_id!: string;

  @Column({ nullable: true })
  credential_url!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}