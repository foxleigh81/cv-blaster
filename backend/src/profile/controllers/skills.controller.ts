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
import { SkillsService } from '../services/skills.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';
import { 
  CreateSkillDto,
  UpdateSkillDto,
  AddUserSkillDto,
  CreateUserSkillDto,
  UpdateUserSkillDto,
  SkillResponseDto,
  UserSkillResponseDto,
  BulkSkillsDto
} from '../dto/skills.dto';
import { plainToClass } from 'class-transformer';

@ApiTags('Profile - Skills')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/profile/skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  // Global Skills Endpoints
  @Get('available')
  @ApiOperation({ summary: 'Get all available skills in the system' })
  @ApiResponse({
    status: 200,
    description: 'Available skills retrieved successfully',
    type: [SkillResponseDto],
  })
  async findAllSkills(): Promise<SkillResponseDto[]> {
    const skills = await this.skillsService.findAllSkills();
    return skills.map(skill => plainToClass(SkillResponseDto, {
      ...skill,
      created_at: skill.created_at.toISOString(),
      updated_at: skill.updated_at.toISOString(),
    }));
  }

  @Post('available')
  @ApiOperation({ summary: 'Create a new skill in the global skills database' })
  @ApiResponse({
    status: 201,
    description: 'Skill created successfully',
    type: SkillResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Skill with this name already exists',
  })
  async createSkill(@Body() createSkillDto: CreateSkillDto): Promise<SkillResponseDto> {
    const skill = await this.skillsService.createSkill(createSkillDto);
    return plainToClass(SkillResponseDto, {
      ...skill,
      created_at: skill.created_at.toISOString(),
      updated_at: skill.updated_at.toISOString(),
    });
  }

  // User Skills Endpoints
  @Get()
  @ApiOperation({ summary: 'Get all skills for the current user' })
  @ApiResponse({
    status: 200,
    description: 'User skills retrieved successfully',
    type: [UserSkillResponseDto],
  })
  async findUserSkills(@CurrentUser() user: User): Promise<UserSkillResponseDto[]> {
    const userSkills = await this.skillsService.findUserSkills(user.id);
    return userSkills.map(userSkill => ({
      skill_id: userSkill.skill_id,
      skill: plainToClass(SkillResponseDto, {
        ...userSkill.skill,
        created_at: userSkill.skill.created_at.toISOString(),
        updated_at: userSkill.skill.updated_at.toISOString(),
      }),
      proficiency: userSkill.proficiency,
      years: userSkill.years,
    }));
  }

  @Get(':skillId')
  @ApiOperation({ summary: 'Get a specific user skill' })
  @ApiParam({ name: 'skillId', description: 'Skill ID' })
  @ApiResponse({
    status: 200,
    description: 'User skill retrieved successfully',
    type: UserSkillResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User skill not found',
  })
  async findUserSkill(
    @Param('skillId') skillId: string,
    @CurrentUser() user: User,
  ): Promise<UserSkillResponseDto> {
    const userSkill = await this.skillsService.findUserSkill(user.id, skillId);
    return {
      skill_id: userSkill.skill_id,
      skill: plainToClass(SkillResponseDto, {
        ...userSkill.skill,
        created_at: userSkill.skill.created_at.toISOString(),
        updated_at: userSkill.skill.updated_at.toISOString(),
      }),
      proficiency: userSkill.proficiency,
      years: userSkill.years,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Add a skill to user (creates skill if it doesn\'t exist)' })
  @ApiResponse({
    status: 201,
    description: 'User skill added successfully',
    type: UserSkillResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'User already has this skill or invalid data',
  })
  async createUserSkill(
    @Body() createUserSkillDto: CreateUserSkillDto,
    @CurrentUser() user: User,
  ): Promise<UserSkillResponseDto> {
    const userSkill = await this.skillsService.createUserSkillWithNewSkill(user.id, createUserSkillDto);
    return {
      skill_id: userSkill.skill_id,
      skill: plainToClass(SkillResponseDto, {
        ...userSkill.skill,
        created_at: userSkill.skill.created_at.toISOString(),
        updated_at: userSkill.skill.updated_at.toISOString(),
      }),
      proficiency: userSkill.proficiency,
      years: userSkill.years,
    };
  }

  @Post('add-existing')
  @ApiOperation({ summary: 'Add an existing skill to user' })
  @ApiResponse({
    status: 201,
    description: 'Existing skill added to user successfully',
    type: UserSkillResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'User already has this skill',
  })
  @ApiResponse({
    status: 404,
    description: 'Skill not found',
  })
  async addExistingSkill(
    @Body() addUserSkillDto: AddUserSkillDto,
    @CurrentUser() user: User,
  ): Promise<UserSkillResponseDto> {
    const userSkill = await this.skillsService.addUserSkill(user.id, addUserSkillDto);
    return {
      skill_id: userSkill.skill_id,
      skill: plainToClass(SkillResponseDto, {
        ...userSkill.skill,
        created_at: userSkill.skill.created_at.toISOString(),
        updated_at: userSkill.skill.updated_at.toISOString(),
      }),
      proficiency: userSkill.proficiency,
      years: userSkill.years,
    };
  }

  @Put(':skillId')
  @ApiOperation({ summary: 'Update user skill proficiency and experience' })
  @ApiParam({ name: 'skillId', description: 'Skill ID' })
  @ApiResponse({
    status: 200,
    description: 'User skill updated successfully',
    type: UserSkillResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User skill not found',
  })
  async updateUserSkill(
    @Param('skillId') skillId: string,
    @Body() updateUserSkillDto: UpdateUserSkillDto,
    @CurrentUser() user: User,
  ): Promise<UserSkillResponseDto> {
    const userSkill = await this.skillsService.updateUserSkill(user.id, skillId, updateUserSkillDto);
    return {
      skill_id: userSkill.skill_id,
      skill: plainToClass(SkillResponseDto, {
        ...userSkill.skill,
        created_at: userSkill.skill.created_at.toISOString(),
        updated_at: userSkill.skill.updated_at.toISOString(),
      }),
      proficiency: userSkill.proficiency,
      years: userSkill.years,
    };
  }

  @Delete(':skillId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a skill from user' })
  @ApiParam({ name: 'skillId', description: 'Skill ID' })
  @ApiResponse({
    status: 204,
    description: 'User skill removed successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User skill not found',
  })
  async removeUserSkill(@Param('skillId') skillId: string, @CurrentUser() user: User): Promise<void> {
    await this.skillsService.removeUserSkill(user.id, skillId);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk create/update user skills' })
  @ApiResponse({
    status: 201,
    description: 'Skills processed successfully',
    type: [UserSkillResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async bulkCreateSkills(
    @Body() bulkSkillsDto: BulkSkillsDto,
    @CurrentUser() user: User,
  ): Promise<UserSkillResponseDto[]> {
    const userSkills = await this.skillsService.bulkCreateUserSkills(user.id, bulkSkillsDto.skills);
    return userSkills.map(userSkill => ({
      skill_id: userSkill.skill_id,
      skill: plainToClass(SkillResponseDto, {
        ...userSkill.skill,
        created_at: userSkill.skill.created_at.toISOString(),
        updated_at: userSkill.skill.updated_at.toISOString(),
      }),
      proficiency: userSkill.proficiency,
      years: userSkill.years,
    }));
  }
}