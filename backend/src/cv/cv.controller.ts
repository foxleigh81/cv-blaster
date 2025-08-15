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
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CVService } from './cv.service';
import { CVBuilderService } from './services/cv-builder.service';
import {
  CVDto,
  CreateCVDto,
  UpdateCVDto,
  DuplicateCVDto,
  CVListItemDto,
  CreateCVFromProfileDto,
} from './dto/cv.dto';
import { CurrentUserData, CVStatistics, CVData, CVSettings, ApiResponse as ApiResponseType } from '../types';

import { CV } from './entities/cv.entity';
@ApiTags('CV Management')
@Controller('api/cv')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CVController {
  constructor(
    private readonly cvService: CVService,
    private readonly cvBuilderService: CVBuilderService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all CVs for the current user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of user CVs',
    type: [CVListItemDto],
  })
  async findAll(@CurrentUser() user: CurrentUserData): Promise<ApiResponseType<CVListItemDto[]>> {
    const cvs = await this.cvService.findAllByUser(user.sub);
    return {
      success: true,
      data: cvs,
    };
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get CV statistics for the current user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'CV statistics',
  })
  async getStatistics(@CurrentUser() user: CurrentUserData): Promise<ApiResponseType<CVStatistics>> {
    const stats = await this.cvService.getCVStatistics(user.sub);
    return {
      success: true,
      data: stats,
    };
  }

  @Get('default')
  @ApiOperation({ summary: 'Get the default CV for the current user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Default CV details',
    type: CVDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No default CV found',
  })
  async getDefault(@CurrentUser() user: CurrentUserData): Promise<ApiResponseType<CVDto | null>> {
    const cv = await this.cvService.getDefaultCV(user.sub);
    return {
      success: true,
      data: this.convertToDto(cv),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific CV by ID' })
  @ApiParam({ name: 'id', description: 'CV ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'CV details',
    type: CVDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'CV not found',
  })
  async findById(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserData,
  ): Promise<ApiResponseType<CVDto>> {
    const cv = await this.cvService.findById(id, user.sub);
    return {
      success: true,
      data: this.convertToDto(cv)!,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new CV manually' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'CV created successfully',
    type: CVDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid CV data',
  })
  async create(
    @Body() createCVDto: CreateCVDto,
    @CurrentUser() user: CurrentUserData,
  ): Promise<ApiResponseType<CVDto>> {
    const cv = await this.cvService.create(user.sub, createCVDto);
    return {
      success: true,
      data: this.convertToDto(cv)!,
    };
  }

  @Post('from-profile')
  @ApiOperation({ summary: 'Create a CV from user profile data' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'CV created from profile successfully',
    type: CVDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid CV data or template not found',
  })
  async createFromProfile(
    @Body() createCVDto: CreateCVFromProfileDto,
    @CurrentUser() user: CurrentUserData,
  ): Promise<ApiResponseType<CVDto>> {
    const cv = await this.cvBuilderService.buildCVFromProfile(user.sub, createCVDto);
    return {
      success: true,
      data: this.convertToDto(cv)!,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a CV' })
  @ApiParam({ name: 'id', description: 'CV ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'CV updated successfully',
    type: CVDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'CV not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCVDto: UpdateCVDto,
    @CurrentUser() user: CurrentUserData,
  ): Promise<ApiResponseType<CVDto>> {
    const cv = await this.cvService.update(id, user.sub, updateCVDto);
    return {
      success: true,
      data: this.convertToDto(cv)!,
    };
  }

  @Put(':id/data')
  @ApiOperation({ summary: 'Update CV data only' })
  @ApiParam({ name: 'id', description: 'CV ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'CV data updated successfully',
    type: CVDto,
  })
  async updateData(
    @Param('id') id: string,
    @Body() data: Partial<CVData>,
    @CurrentUser() user: CurrentUserData,
  ): Promise<ApiResponseType<CVDto>> {
    const cv = await this.cvService.updateCVData(id, user.sub, data);
    return {
      success: true,
      data: this.convertToDto(cv)!,
    };
  }

  @Put(':id/settings')
  @ApiOperation({ summary: 'Update CV settings only' })
  @ApiParam({ name: 'id', description: 'CV ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'CV settings updated successfully',
    type: CVDto,
  })
  async updateSettings(
    @Param('id') id: string,
    @Body() settings: Partial<CVSettings>,
    @CurrentUser() user: CurrentUserData,
  ): Promise<ApiResponseType<CVDto>> {
    const cv = await this.cvService.updateCVSettings(id, user.sub, settings);
    return {
      success: true,
      data: this.convertToDto(cv)!,
    };
  }

  @Put(':id/default')
  @ApiOperation({ summary: 'Set a CV as the default' })
  @ApiParam({ name: 'id', description: 'CV ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'CV set as default successfully',
    type: CVDto,
  })
  async setAsDefault(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserData,
  ): Promise<ApiResponseType<CVDto>> {
    const cv = await this.cvService.setAsDefault(id, user.sub);
    return {
      success: true,
      data: this.convertToDto(cv)!,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a CV' })
  @ApiParam({ name: 'id', description: 'CV ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'CV deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'CV not found',
  })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserData,
  ): Promise<ApiResponseType<string>> {
    await this.cvService.delete(id, user.sub);
    return {
      success: true,
      data: 'CV deleted successfully',
      message: 'CV deleted successfully',
    };
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplicate a CV' })
  @ApiParam({ name: 'id', description: 'CV ID to duplicate' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'CV duplicated successfully',
    type: CVDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Original CV not found',
  })
  async duplicate(
    @Param('id') id: string,
    @Body() duplicateCVDto: DuplicateCVDto,
    @CurrentUser() user: CurrentUserData,
  ): Promise<ApiResponseType<CVDto>> {
    const cv = await this.cvBuilderService.duplicateCV(
      id,
      user.sub,
      duplicateCVDto.name,
      duplicateCVDto.template_id,
    );
    return {
      success: true,
      data: this.convertToDto(cv)!,
    };
  }

  @Post(':id/rebuild')
  @ApiOperation({ summary: 'Rebuild a CV from current profile data' })
  @ApiParam({ name: 'id', description: 'CV ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'CV rebuilt successfully',
    type: CVDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'CV not found',
  })
  async rebuild(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserData,
  ): Promise<ApiResponseType<CVDto>> {
    const cv = await this.cvBuilderService.rebuildCVFromProfile(id, user.sub);
    return {
      success: true,
      data: this.convertToDto(cv)!,
    };
  }
  // Helper method to convert CV entity to CVDto
  private convertToDto(cv: CV | null): CVDto | null {
    if (!cv) return null;
    
    return {
      id: cv.id,
      user_id: cv.user_id,
      template_id: cv.template_id,
      name: cv.name,
      data: cv.data ?? undefined,
      settings: cv.settings ?? undefined,
      is_default: cv.is_default,
      created_at: cv.created_at,
      updated_at: cv.updated_at,
      sections: cv.sections?.map(section => ({
        id: section.id,
        cv_id: section.cv_id,
        section_type: section.section_type,
        title: section.title,
        content: section.content,
        order: section.order,
        visible: section.visible,
      })),
      template: cv.template ? {
        id: cv.template.id,
        name: cv.template.name,
        description: cv.template.description,
      } : undefined,
    } as CVDto;
  }
}
