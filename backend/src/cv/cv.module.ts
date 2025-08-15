import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CV } from './entities/cv.entity';
import { CVSection } from './entities/cv-section.entity';
import { CVTemplate } from './entities/cv-template.entity';
import { User } from '../users/entities/user.entity';
import { Profile } from '../users/entities/profile.entity';
import { Employment } from '../profile/entities/employment.entity';
import { Education } from '../profile/entities/education.entity';
import { UserSkill } from '../profile/entities/user-skill.entity';
import { Certificate } from '../profile/entities/certificate.entity';
import { Award } from '../profile/entities/award.entity';
import { CVController } from './cv.controller';
import { CVEditorController } from './cv-editor.controller';
import { CVService } from './cv.service';
import { CVBuilderService } from './services/cv-builder.service';
import { CVEditorService } from './services/cv-editor.service';
import { UsersModule } from '../users/users.module';
import { ProfileModule } from '../profile/profile.module';
import { CVTemplatesModule } from '../cv-templates/cv-templates.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CV, 
      CVSection, 
      CVTemplate, 
      User, 
      Profile, 
      Employment, 
      Education, 
      UserSkill, 
      Certificate, 
      Award
    ]),
    UsersModule,
    ProfileModule,
    CVTemplatesModule,
  ],
  controllers: [CVController, CVEditorController],
  providers: [CVService, CVBuilderService, CVEditorService],
  exports: [CVService, CVBuilderService, CVEditorService],
})
export class CVModule {}