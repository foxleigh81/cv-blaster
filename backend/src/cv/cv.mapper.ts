import { CV } from './entities/cv.entity';
import { CVDto } from './dto/cv.dto';

export class CVMapper {
  static toDto(entity: CV): CVDto {
    const dto = new CVDto();
    dto.id = entity.id;
    dto.user_id = entity.user_id;
    dto.template_id = entity.template_id;
    dto.name = entity.name;
    dto.data = entity.data ?? undefined;
    dto.settings = entity.settings ?? undefined;
    dto.is_default = entity.is_default;
    dto.created_at = entity.created_at;
    dto.updated_at = entity.updated_at;
    
    if (entity.template) {
      dto.template = {
        id: entity.template.id,
        name: entity.template.name,
        description: entity.template.description ?? undefined
      };
    }
    
    return dto;
  }

  static toDtoArray(entities: CV[]): CVDto[] {
    return entities.map(entity => this.toDto(entity));
  }
}
