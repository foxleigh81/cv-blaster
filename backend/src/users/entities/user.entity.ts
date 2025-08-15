import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Profile } from './profile.entity';
import { Employment } from '../../profile/entities/employment.entity';
import { Education } from '../../profile/entities/education.entity';
import { Certificate } from '../../profile/entities/certificate.entity';
import { Award } from '../../profile/entities/award.entity';
import { UserSkill } from '../../profile/entities/user-skill.entity';
import { UserPreferences } from '../../types';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column({ default: 'user' })
  role!: string;

  @Column({ type: 'varchar', nullable: true })
  oauth_provider!: string | null;

  @Column({ type: 'varchar', nullable: true })
  oauth_id!: string | null;

  @Column({ 
    type: 'jsonb', 
    nullable: true,
    default: () => `'{
      "email_notifications": true,
      "marketing_emails": false,
      "language": "en",
      "timezone": "UTC"
    }'::jsonb`
  })
  preferences!: UserPreferences;

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile!: Profile;

  @OneToMany(() => Employment, (employment) => employment.user)
  employment_history!: Employment[];

  @OneToMany(() => Education, (education) => education.user)
  education!: Education[];

  @OneToMany(() => Certificate, (certificate) => certificate.user)
  certificates!: Certificate[];

  @OneToMany(() => Award, (award) => award.user)
  awards!: Award[];

  @OneToMany(() => UserSkill, (userSkill) => userSkill.user)
  user_skills!: UserSkill[];
}
