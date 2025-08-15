import { CVTemplate } from '../cv/entities/cv-template.entity';
import { CVTemplateDto } from './dto/cv-template.dto';

export class CVTemplateMapper {
  static toDto(entity: CVTemplate): CVTemplateDto {
    const dto = new CVTemplateDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.description = entity.description ?? undefined;
    dto.structure = entity.structure;
    dto.styles = entity.styles ?? undefined;
    dto.active = entity.active;
    dto.created_at = entity.created_at;
    dto.updated_at = entity.updated_at;
    return dto;
  }

  static toDtoArray(entities: CVTemplate[]): CVTemplateDto[] {
    return entities.map(entity => this.toDto(entity));
  }
}
