import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { CVTemplate } from './cv-template.entity';
import { CVSection } from './cv-section.entity';
import { CVData, CVSettings } from '../../types';

@Entity('cvs')
export class CV extends BaseEntity {
  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'uuid' })
  template_id!: string;

  @Column()
  name!: string;

  @Column({ type: 'jsonb', nullable: true })
  data!: CVData | null;

  @Column({ type: 'jsonb', nullable: true })
  settings!: CVSettings | null;

  @Column({ default: false })
  is_default!: boolean;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => CVTemplate)
  @JoinColumn({ name: 'template_id' })
  template!: CVTemplate;

  @OneToMany(() => CVSection, (section) => section.cv, { cascade: true })
  sections!: CVSection[];
}
