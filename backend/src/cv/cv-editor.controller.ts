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
import { CVEditorService } from './services/cv-editor.service';
import { CurrentUserData } from '../types';
import {
  CreateCustomSectionDto,
  UpdateSectionDto,
  ReorderSectionsDto,
  UpdateSectionVisibilityDto,
  BulkUpdateSectionsDto,
  CVSectionResponseDto,
} from './dto/cv-section.dto';

@ApiTags('CV Editor')
@Controller('api/cv/:cvId/sections')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CVEditorController {
  constructor(private readonly cvEditorService: CVEditorService) {}

  @Get()
  @ApiOperation({ summary: 'Get sections by type' })
  @ApiParam({ name: 'cvId', description: 'CV ID' })
  @ApiQuery({ name: 'type', description: 'Section type', required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'CV sections',
    type: [CVSectionResponseDto],
  })
  async getSectionsByType(
    @Param('cvId') cvId: string,
    @Query('type') sectionType: string,
    @CurrentUser() user: CurrentUserData,
  ): Promise<{ success: boolean; data: CVSectionResponseDto[] }> {
    const sections = await this.cvEditorService.getSectionsByType(
      cvId,
      user.sub,
      sectionType,
    );
    return {
      success: true,
      data: sections,
    };
  }

  @Post('custom')
  @ApiOperation({ summary: 'Add a custom section to the CV' })
  @ApiParam({ name: 'cvId', description: 'CV ID' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Custom section added successfully',
    type: CVSectionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'CV not found',
  })
  async addCustomSection(
    @Param('cvId') cvId: string,
    @Body() createSectionDto: CreateCustomSectionDto,
    @CurrentUser() user: CurrentUserData,
  ): Promise<{ success: boolean; data: CVSectionResponseDto }> {
    const section = await this.cvEditorService.addCustomSection(
      cvId,
      user.sub,
      createSectionDto,
    );
    return {
      success: true,
      data: section,
    };
  }

  @Put('order')
  @ApiOperation({ summary: 'Reorder CV sections' })
  @ApiParam({ name: 'cvId', description: 'CV ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sections reordered successfully',
    type: [CVSectionResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid section order data',
  })
  async reorderSections(
    @Param('cvId') cvId: string,
    @Body() reorderDto: ReorderSectionsDto,
    @CurrentUser() user: CurrentUserData,
  ): Promise<{ success: boolean; data: CVSectionResponseDto[] }> {
    const sections = await this.cvEditorService.reorderSections(
      cvId,
      user.sub,
      reorderDto,
    );
    return {
      success: true,
      data: sections,
    };
  }

  @Post('reset-order')
  @ApiOperation({ summary: 'Reset sections to default order' })
  @ApiParam({ name: 'cvId', description: 'CV ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Section order reset successfully',
    type: [CVSectionResponseDto],
  })
  async resetSectionOrder(
    @Param('cvId') cvId: string,
    @CurrentUser() user: CurrentUserData,
  ): Promise<{ success: boolean; data: CVSectionResponseDto[] }> {
    const sections = await this.cvEditorService.resetSectionOrder(cvId, user.sub);
    return {
      success: true,
      data: sections,
    };
  }

  @Put('bulk')
  @ApiOperation({ summary: 'Bulk update multiple sections' })
  @ApiParam({ name: 'cvId', description: 'CV ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sections updated successfully',
    type: [CVSectionResponseDto],
  })
  async bulkUpdateSections(
    @Param('cvId') cvId: string,
    @Body() bulkUpdateDto: BulkUpdateSectionsDto,
    @CurrentUser() user: CurrentUserData,
  ): Promise<{ success: boolean; data: CVSectionResponseDto[] }> {
    const sections = await this.cvEditorService.bulkUpdateSections(
      cvId,
      user.sub,
      bulkUpdateDto,
    );
    return {
      success: true,
      data: sections,
    };
  }

  @Put(':sectionId')
  @ApiOperation({ summary: 'Update a specific section' })
  @ApiParam({ name: 'cvId', description: 'CV ID' })
  @ApiParam({ name: 'sectionId', description: 'Section ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Section updated successfully',
    type: CVSectionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Section not found',
  })
  async updateSection(
    @Param('cvId') cvId: string,
    @Param('sectionId') sectionId: string,
    @Body() updateDto: UpdateSectionDto,
    @CurrentUser() user: CurrentUserData,
  ): Promise<{ success: boolean; data: CVSectionResponseDto }> {
    const section = await this.cvEditorService.updateSection(
      cvId,
      sectionId,
      user.sub,
      updateDto,
    );
    return {
      success: true,
      data: section,
    };
  }

  @Put(':sectionId/visibility')
  @ApiOperation({ summary: 'Toggle section visibility' })
  @ApiParam({ name: 'cvId', description: 'CV ID' })
  @ApiParam({ name: 'sectionId', description: 'Section ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Section visibility updated successfully',
    type: CVSectionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot hide required sections',
  })
  async updateSectionVisibility(
    @Param('cvId') cvId: string,
    @Param('sectionId') sectionId: string,
    @Body() visibilityDto: UpdateSectionVisibilityDto,
    @CurrentUser() user: CurrentUserData,
  ): Promise<{ success: boolean; data: CVSectionResponseDto }> {
    const section = await this.cvEditorService.updateSectionVisibility(
      cvId,
      sectionId,
      user.sub,
      visibilityDto.visible,
    );
    return {
      success: true,
      data: section,
    };
  }

  @Post(':sectionId/duplicate')
  @ApiOperation({ summary: 'Duplicate a section' })
  @ApiParam({ name: 'cvId', description: 'CV ID' })
  @ApiParam({ name: 'sectionId', description: 'Section ID to duplicate' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Section duplicated successfully',
    type: CVSectionResponseDto,
  })
  async duplicateSection(
    @Param('cvId') cvId: string,
    @Param('sectionId') sectionId: string,
    @Body() duplicateData: { title?: string },
    @CurrentUser() user: CurrentUserData,
  ): Promise<{ success: boolean; data: CVSectionResponseDto }> {
    const section = await this.cvEditorService.duplicateSection(
      cvId,
      sectionId,
      user.sub,
      duplicateData.title,
    );
    return {
      success: true,
      data: section,
    };
  }

  @Delete(':sectionId')
  @ApiOperation({ summary: 'Delete a section' })
  @ApiParam({ name: 'cvId', description: 'CV ID' })
  @ApiParam({ name: 'sectionId', description: 'Section ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Section deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Section not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot delete required sections',
  })
  async deleteSection(
    @Param('cvId') cvId: string,
    @Param('sectionId') sectionId: string,
    @CurrentUser() user: CurrentUserData,
  ): Promise<{ success: boolean; message: string }> {
    await this.cvEditorService.deleteSection(cvId, sectionId, user.sub);
    return {
      success: true,
      message: 'Section deleted successfully',
    };
  }
}