import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CVTemplate } from '../cv/entities/cv-template.entity';
import { CVTemplatesController } from './cv-templates.controller';
import { CVTemplatesService } from './cv-templates.service';
import { TemplateEngineService } from './services/template-engine.service';

@Module({
  imports: [TypeOrmModule.forFeature([CVTemplate])],
  controllers: [CVTemplatesController],
  providers: [CVTemplatesService, TemplateEngineService],
  exports: [CVTemplatesService, TemplateEngineService],
})
export class CVTemplatesModule {}