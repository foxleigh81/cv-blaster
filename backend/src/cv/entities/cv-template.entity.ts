import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { CV } from './cv.entity';

@Entity('cv_templates')
export class CVTemplate extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb' })
  structure: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  styles: Record<string, any>;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => CV, (cv) => cv.template)
  cvs: CV[];
}