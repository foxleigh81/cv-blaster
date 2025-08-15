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
import { EmploymentService } from '../services/employment.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';
import { 
  CreateEmploymentDto, 
  UpdateEmploymentDto, 
  EmploymentResponseDto,
  BulkEmploymentDto 
} from '../dto/employment.dto';
import { plainToClass } from 'class-transformer';

@ApiTags('Profile - Employment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/profile/employment')
export class EmploymentController {
  constructor(private readonly employmentService: EmploymentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all employment records for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Employment records retrieved successfully',
    type: [EmploymentResponseDto],
  })
  async findAll(@CurrentUser() user: User): Promise<EmploymentResponseDto[]> {
    const employment = await this.employmentService.findAll(user.id);
    return employment.map(emp => plainToClass(EmploymentResponseDto, {
      ...emp,
      start_date: emp.start_date.toISOString(),
      end_date: emp.end_date?.toISOString(),
      created_at: emp.created_at.toISOString(),
      updated_at: emp.updated_at.toISOString(),
    }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific employment record' })
  @ApiParam({ name: 'id', description: 'Employment record ID' })
  @ApiResponse({
    status: 200,
    description: 'Employment record retrieved successfully',
    type: EmploymentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Employment record not found',
  })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<EmploymentResponseDto> {
    const employment = await this.employmentService.findOne(id, user.id);
    return plainToClass(EmploymentResponseDto, {
      ...employment,
      start_date: employment.start_date.toISOString(),
      end_date: employment.end_date?.toISOString(),
      created_at: employment.created_at.toISOString(),
      updated_at: employment.updated_at.toISOString(),
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new employment record' })
  @ApiResponse({
    status: 201,
    description: 'Employment record created successfully',
    type: EmploymentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async create(
    @Body() createEmploymentDto: CreateEmploymentDto,
    @CurrentUser() user: User,
  ): Promise<EmploymentResponseDto> {
    const employment = await this.employmentService.create(user.id, createEmploymentDto);
    return plainToClass(EmploymentResponseDto, {
      ...employment,
      start_date: employment.start_date.toISOString(),
      end_date: employment.end_date?.toISOString(),
      created_at: employment.created_at.toISOString(),
      updated_at: employment.updated_at.toISOString(),
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an employment record' })
  @ApiParam({ name: 'id', description: 'Employment record ID' })
  @ApiResponse({
    status: 200,
    description: 'Employment record updated successfully',
    type: EmploymentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Employment record not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateEmploymentDto: UpdateEmploymentDto,
    @CurrentUser() user: User,
  ): Promise<EmploymentResponseDto> {
    const employment = await this.employmentService.update(id, user.id, updateEmploymentDto);
    return plainToClass(EmploymentResponseDto, {
      ...employment,
      start_date: employment.start_date.toISOString(),
      end_date: employment.end_date?.toISOString(),
      created_at: employment.created_at.toISOString(),
      updated_at: employment.updated_at.toISOString(),
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an employment record' })
  @ApiParam({ name: 'id', description: 'Employment record ID' })
  @ApiResponse({
    status: 204,
    description: 'Employment record deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Employment record not found',
  })
  async remove(@Param('id') id: string, @CurrentUser() user: User): Promise<void> {
    await this.employmentService.remove(id, user.id);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk create/update employment records' })
  @ApiResponse({
    status: 201,
    description: 'Employment records processed successfully',
    type: [EmploymentResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async bulkCreate(
    @Body() bulkEmploymentDto: BulkEmploymentDto,
    @CurrentUser() user: User,
  ): Promise<EmploymentResponseDto[]> {
    const employment = await this.employmentService.bulkCreate(user.id, bulkEmploymentDto.employment);
    return employment.map(emp => plainToClass(EmploymentResponseDto, {
      ...emp,
      start_date: emp.start_date.toISOString(),
      end_date: emp.end_date?.toISOString(),
      created_at: emp.created_at.toISOString(),
      updated_at: emp.updated_at.toISOString(),
    }));
  }
}