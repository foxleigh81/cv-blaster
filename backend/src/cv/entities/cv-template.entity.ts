import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { CV } from './cv.entity';
import { TemplateStructure, TemplateStyles } from '../../types';

@Entity('cv_templates')
export class CVTemplate extends BaseEntity {
  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'jsonb' })
  structure!: TemplateStructure;

  @Column({ type: 'jsonb', nullable: true })
  styles!: TemplateStyles | null;

  @Column({ default: true })
  active!: boolean;

  @OneToMany(() => CV, (cv) => cv.template)
  cvs!: CV[];
}
