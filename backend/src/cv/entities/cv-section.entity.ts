import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { CV } from './cv.entity';

@Entity('cv_sections')
export class CVSection extends BaseEntity {
  @Column({ type: 'uuid' })
  cv_id: string;

  @Column()
  section_type: string; // 'employment', 'education', 'skills', 'custom', etc.

  @Column()
  title: string;

  @Column({ type: 'jsonb' })
  content: Record<string, any>;

  @Column({ type: 'smallint', default: 0 })
  order: number;

  @Column({ default: true })
  visible: boolean;

  @ManyToOne(() => CV, (cv) => cv.sections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cv_id' })
  cv: CV;
}