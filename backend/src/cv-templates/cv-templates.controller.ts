import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CVTemplatesService } from './cv-templates.service';
import { TemplateEngineService } from './services/template-engine.service';
import { CVTemplateMapper } from './cv-templates.mapper';
import {
  CVTemplateDto,
  CreateCVTemplateDto,
  UpdateCVTemplateDto,
} from './dto/cv-template.dto';

@ApiTags('CV Templates')
@Controller('api/cv-templates')
export class CVTemplatesController {
  constructor(
    private readonly templatesService: CVTemplatesService,
    private readonly templateEngineService: TemplateEngineService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all available CV templates' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of available CV templates',
    type: [CVTemplateDto],
  })
  async findAll(): Promise<{ success: boolean; data: CVTemplateDto[] }> {
    const templates = await this.templatesService.findAll();
    return {
      success: true,
      data: CVTemplateMapper.toDtoArray(templates),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific CV template by ID' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'CV template details',
    type: CVTemplateDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Template not found',
  })
  async findById(@Param('id') id: string): Promise<{ success: boolean; data: CVTemplateDto }> {
    const template = await this.templatesService.findById(id);
    return {
      success: true,
      data: CVTemplateMapper.toDto(template),
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new CV template (Admin only)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Template created successfully',
    type: CVTemplateDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid template data',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Admin access required',
  })
  async create(
    @Body() createTemplateDto: CreateCVTemplateDto,
  ): Promise<{ success: boolean; data: CVTemplateDto }> {
    // Validate template structure
    const validation = this.templateEngineService.validateTemplateStructure(
      createTemplateDto.structure,
    );

    if (!validation.valid) {
      throw new Error('Invalid template structure: ' + validation.errors.join(', '));
    }

    const template = await this.templatesService.create(createTemplateDto);
    return {
      success: true,
      data: CVTemplateMapper.toDto(template),
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a CV template (Admin only)' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Template updated successfully',
    type: CVTemplateDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Template not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Admin access required',
  })
  async update(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateCVTemplateDto,
  ): Promise<{ success: boolean; data: CVTemplateDto }> {
    // Validate template structure if provided
    if (updateTemplateDto.structure) {
      const validation = this.templateEngineService.validateTemplateStructure(
        updateTemplateDto.structure,
      );

      if (!validation.valid) {
        throw new Error('Invalid template structure: ' + validation.errors.join(', '));
      }
    }

    const template = await this.templatesService.update(id, updateTemplateDto);
    return {
      success: true,
      data: CVTemplateMapper.toDto(template),
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a CV template (Admin only)' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Template deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Template not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Admin access required',
  })
  async delete(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    await this.templatesService.delete(id);
    return {
      success: true,
      message: 'Template deleted successfully',
    };
  }

  @Get(':id/default-sections')
  @ApiOperation({ summary: 'Get default section order for a template' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Default section order',
  })
  async getDefaultSections(
    @Param('id') id: string,
  ): Promise<{ success: boolean; data: { sections: string[] } }> {
    const template = await this.templatesService.findById(id);
    const sections = this.templateEngineService.getDefaultSectionOrder(template);
    
    return {
      success: true,
      data: { sections },
    };
  }

  @Post('seed')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Seed default templates (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Default templates seeded successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Admin access required',
  })
  async seedTemplates(): Promise<{ success: boolean; message: string }> {
    await this.templatesService.seedDefaultTemplates();
    return {
      success: true,
      message: 'Default templates seeded successfully',
    };
  }
}
