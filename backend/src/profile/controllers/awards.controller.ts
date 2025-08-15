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
import { AwardsService } from '../services/awards.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';
import { 
  CreateAwardDto, 
  UpdateAwardDto, 
  AwardResponseDto,
  BulkAwardsDto 
} from '../dto/awards.dto';
import { plainToClass } from 'class-transformer';

@ApiTags('Profile - Awards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/profile/awards')
export class AwardsController {
  constructor(private readonly awardsService: AwardsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all awards for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Awards retrieved successfully',
    type: [AwardResponseDto],
  })
  async findAll(@CurrentUser() user: User): Promise<AwardResponseDto[]> {
    const awards = await this.awardsService.findAll(user.id);
    return awards.map(award => plainToClass(AwardResponseDto, {
      ...award,
      date_received: award.date_received?.toISOString(),
      created_at: award.created_at.toISOString(),
      updated_at: award.updated_at.toISOString(),
    }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific award' })
  @ApiParam({ name: 'id', description: 'Award ID' })
  @ApiResponse({
    status: 200,
    description: 'Award retrieved successfully',
    type: AwardResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Award not found',
  })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<AwardResponseDto> {
    const award = await this.awardsService.findOne(id, user.id);
    return plainToClass(AwardResponseDto, {
      ...award,
      date_received: award.date_received?.toISOString(),
      created_at: award.created_at.toISOString(),
      updated_at: award.updated_at.toISOString(),
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new award' })
  @ApiResponse({
    status: 201,
    description: 'Award created successfully',
    type: AwardResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async create(
    @Body() createAwardDto: CreateAwardDto,
    @CurrentUser() user: User,
  ): Promise<AwardResponseDto> {
    const award = await this.awardsService.create(user.id, createAwardDto);
    return plainToClass(AwardResponseDto, {
      ...award,
      date_received: award.date_received?.toISOString(),
      created_at: award.created_at.toISOString(),
      updated_at: award.updated_at.toISOString(),
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an award' })
  @ApiParam({ name: 'id', description: 'Award ID' })
  @ApiResponse({
    status: 200,
    description: 'Award updated successfully',
    type: AwardResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Award not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateAwardDto: UpdateAwardDto,
    @CurrentUser() user: User,
  ): Promise<AwardResponseDto> {
    const award = await this.awardsService.update(id, user.id, updateAwardDto);
    return plainToClass(AwardResponseDto, {
      ...award,
      date_received: award.date_received?.toISOString(),
      created_at: award.created_at.toISOString(),
      updated_at: award.updated_at.toISOString(),
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an award' })
  @ApiParam({ name: 'id', description: 'Award ID' })
  @ApiResponse({
    status: 204,
    description: 'Award deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Award not found',
  })
  async remove(@Param('id') id: string, @CurrentUser() user: User): Promise<void> {
    await this.awardsService.remove(id, user.id);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk create/update awards' })
  @ApiResponse({
    status: 201,
    description: 'Awards processed successfully',
    type: [AwardResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async bulkCreate(
    @Body() bulkAwardsDto: BulkAwardsDto,
    @CurrentUser() user: User,
  ): Promise<AwardResponseDto[]> {
    const awards = await this.awardsService.bulkCreate(user.id, bulkAwardsDto.awards);
    return awards.map(award => plainToClass(AwardResponseDto, {
      ...award,
      date_received: award.date_received?.toISOString(),
      created_at: award.created_at.toISOString(),
      updated_at: award.updated_at.toISOString(),
    }));
  }
}