import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserPreferencesDto, CreateUserPreferencesDto } from './dto/user-preferences.dto';
import { UserResponseDto, ProfileResponseDto } from './dto/user-response.dto';
import { plainToClass } from 'class-transformer';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile with all related data' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getProfile(@CurrentUser() user: User): Promise<UserResponseDto> {
    const fullUser = await this.usersService.getUserProfile(user.id);
    return plainToClass(UserResponseDto, fullUser, {
      excludeExtraneousValues: false,
    });
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update user profile information' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    const profile = await this.usersService.updateProfile(user.id, updateProfileDto);
    return plainToClass(ProfileResponseDto, profile);
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Get user preferences' })
  @ApiResponse({
    status: 200,
    description: 'User preferences retrieved successfully',
    type: CreateUserPreferencesDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getPreferences(@CurrentUser() user: User): Promise<CreateUserPreferencesDto> {
    return await this.usersService.getPreferences(user.id);
  }

  @Put('preferences')
  @ApiOperation({ summary: 'Update user preferences' })
  @ApiResponse({
    status: 200,
    description: 'Preferences updated successfully',
    type: CreateUserPreferencesDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async updatePreferences(
    @CurrentUser() user: User,
    @Body() updatePreferencesDto: UpdateUserPreferencesDto,
  ): Promise<CreateUserPreferencesDto> {
    return await this.usersService.updatePreferences(user.id, updatePreferencesDto);
  }

  @Delete('account')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete user account' })
  @ApiResponse({
    status: 204,
    description: 'Account deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async deleteAccount(@CurrentUser() user: User): Promise<void> {
    await this.usersService.softDeleteAccount(user.id);
  }
}