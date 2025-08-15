import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employment } from './entities/employment.entity';
import { Education } from './entities/education.entity';
import { Skill } from './entities/skill.entity';
import { UserSkill } from './entities/user-skill.entity';
import { Certificate } from './entities/certificate.entity';
import { Award } from './entities/award.entity';

// Import controllers
import { EmploymentController } from './controllers/employment.controller';
import { EducationController } from './controllers/education.controller';
import { SkillsController } from './controllers/skills.controller';
import { CertificatesController } from './controllers/certificates.controller';
import { AwardsController } from './controllers/awards.controller';

// Import services
import { EmploymentService } from './services/employment.service';
import { EducationService } from './services/education.service';
import { SkillsService } from './services/skills.service';
import { CertificatesService } from './services/certificates.service';
import { AwardsService } from './services/awards.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employment,
      Education,
      Skill,
      UserSkill,
      Certificate,
      Award,
    ]),
  ],
  controllers: [
    EmploymentController,
    EducationController,
    SkillsController,
    CertificatesController,
    AwardsController,
  ],
  providers: [
    EmploymentService,
    EducationService,
    SkillsService,
    CertificatesService,
    AwardsService,
  ],
  exports: [
    EmploymentService,
    EducationService,
    SkillsService,
    CertificatesService,
    AwardsService,
  ],
})
export class ProfileModule {}