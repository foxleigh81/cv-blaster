import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { EducationService } from '../services/education.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';
import { 
  CreateEducationDto, 
  UpdateEducationDto, 
  EducationResponseDto,
  BulkEducationDto 
} from '../dto/education.dto';
import { plainToClass } from 'class-transformer';

@ApiTags('Profile - Education')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/profile/education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all education records for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Education records retrieved successfully',
    type: [EducationResponseDto],
  })
  async findAll(@CurrentUser() user: User): Promise<EducationResponseDto[]> {
    const education = await this.educationService.findAll(user.id);
    return education.map(edu => plainToClass(EducationResponseDto, {
      ...edu,
      graduation_date: edu.graduation_date?.toISOString(),
      created_at: edu.created_at.toISOString(),
      updated_at: edu.updated_at.toISOString(),
    }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific education record' })
  @ApiParam({ name: 'id', description: 'Education record ID' })
  @ApiResponse({
    status: 200,
    description: 'Education record retrieved successfully',
    type: EducationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Education record not found',
  })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<EducationResponseDto> {
    const education = await this.educationService.findOne(id, user.id);
    return plainToClass(EducationResponseDto, {
      ...education,
      graduation_date: education.graduation_date?.toISOString(),
      created_at: education.created_at.toISOString(),
      updated_at: education.updated_at.toISOString(),
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new education record' })
  @ApiResponse({
    status: 201,
    description: 'Education record created successfully',
    type: EducationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async create(
    @Body() createEducationDto: CreateEducationDto,
    @CurrentUser() user: User,
  ): Promise<EducationResponseDto> {
    const education = await this.educationService.create(user.id, createEducationDto);
    return plainToClass(EducationResponseDto, {
      ...education,
      graduation_date: education.graduation_date?.toISOString(),
      created_at: education.created_at.toISOString(),
      updated_at: education.updated_at.toISOString(),
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an education record' })
  @ApiParam({ name: 'id', description: 'Education record ID' })
  @ApiResponse({
    status: 200,
    description: 'Education record updated successfully',
    type: EducationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Education record not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateEducationDto: UpdateEducationDto,
    @CurrentUser() user: User,
  ): Promise<EducationResponseDto> {
    const education = await this.educationService.update(id, user.id, updateEducationDto);
    return plainToClass(EducationResponseDto, {
      ...education,
      graduation_date: education.graduation_date?.toISOString(),
      created_at: education.created_at.toISOString(),
      updated_at: education.updated_at.toISOString(),
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an education record' })
  @ApiParam({ name: 'id', description: 'Education record ID' })
  @ApiResponse({
    status: 204,
    description: 'Education record deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Education record not found',
  })
  async remove(@Param('id') id: string, @CurrentUser() user: User): Promise<void> {
    await this.educationService.remove(id, user.id);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk create/update education records' })
  @ApiResponse({
    status: 201,
    description: 'Education records processed successfully',
    type: [EducationResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async bulkCreate(
    @Body() bulkEducationDto: BulkEducationDto,
    @CurrentUser() user: User,
  ): Promise<EducationResponseDto[]> {
    const education = await this.educationService.bulkCreate(user.id, bulkEducationDto.education);
    return education.map(edu => plainToClass(EducationResponseDto, {
      ...edu,
      graduation_date: edu.graduation_date?.toISOString(),
      created_at: edu.created_at.toISOString(),
      updated_at: edu.updated_at.toISOString(),
    }));
  }
}