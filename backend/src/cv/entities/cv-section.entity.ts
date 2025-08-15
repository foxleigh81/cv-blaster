import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { CV } from './cv.entity';
import { SectionContent } from '../../types';

@Entity('cv_sections')
export class CVSection extends BaseEntity {
  @Column({ type: 'uuid' })
  cv_id!: string;

  @Column()
  section_type!: string; // Using string to allow custom section types beyond the enum

  @Column()
  title!: string;

  @Column({ type: 'jsonb' })
  content!: SectionContent;

  @Column({ type: 'smallint', default: 0 })
  order!: number;

  @Column({ default: true })
  visible!: boolean;

  @ManyToOne(() => CV, (cv) => cv.sections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cv_id' })
  cv!: CV;
}
