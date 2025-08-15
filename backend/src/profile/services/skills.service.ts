import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from '../entities/skill.entity';
import { UserSkill } from '../entities/user-skill.entity';
import { 
  CreateSkillDto, 
  UpdateSkillDto,
  AddUserSkillDto,
  CreateUserSkillDto,
  UpdateUserSkillDto 
} from '../dto/skills.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
    @InjectRepository(UserSkill)
    private readonly userSkillRepository: Repository<UserSkill>,
  ) {}

  // Global Skills Management
  async findAllSkills(): Promise<Skill[]> {
    return await this.skillRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findSkillById(id: string): Promise<Skill> {
    const skill = await this.skillRepository.findOne({ where: { id } });
    if (!skill) {
      throw new NotFoundException('Skill not found');
    }
    return skill;
  }

  async createSkill(createSkillDto: CreateSkillDto): Promise<Skill> {
    const existingSkill = await this.skillRepository.findOne({
      where: { name: createSkillDto.name },
    });

    if (existingSkill) {
      throw new BadRequestException('Skill with this name already exists');
    }

    const skill = this.skillRepository.create(createSkillDto);
    return await this.skillRepository.save(skill);
  }

  async updateSkill(id: string, updateSkillDto: UpdateSkillDto): Promise<Skill> {
    const skill = await this.findSkillById(id);
    
    if (updateSkillDto.name && updateSkillDto.name !== skill.name) {
      const existingSkill = await this.skillRepository.findOne({
        where: { name: updateSkillDto.name },
      });
      if (existingSkill) {
        throw new BadRequestException('Skill with this name already exists');
      }
    }

    Object.assign(skill, updateSkillDto);
    return await this.skillRepository.save(skill);
  }

  async removeSkill(id: string): Promise<void> {
    const skill = await this.findSkillById(id);
    await this.skillRepository.remove(skill);
  }

  // User Skills Management
  async findUserSkills(userId: string): Promise<UserSkill[]> {
    return await this.userSkillRepository.find({
      where: { user_id: userId },
      relations: ['skill'],
      order: { skill: { name: 'ASC' } },
    });
  }

  async findUserSkill(userId: string, skillId: string): Promise<UserSkill> {
    const userSkill = await this.userSkillRepository.findOne({
      where: { user_id: userId, skill_id: skillId },
      relations: ['skill'],
    });

    if (!userSkill) {
      throw new NotFoundException('User skill not found');
    }

    return userSkill;
  }

  async addUserSkill(userId: string, addUserSkillDto: AddUserSkillDto): Promise<UserSkill> {
    // Verify skill exists
    await this.findSkillById(addUserSkillDto.skill_id);

    // Check if user already has this skill
    const existingUserSkill = await this.userSkillRepository.findOne({
      where: { user_id: userId, skill_id: addUserSkillDto.skill_id },
    });

    if (existingUserSkill) {
      throw new BadRequestException('User already has this skill');
    }

    const userSkill = this.userSkillRepository.create({
      user_id: userId,
      skill_id: addUserSkillDto.skill_id,
      proficiency: addUserSkillDto.proficiency,
      years: addUserSkillDto.years,
    });

    const saved = await this.userSkillRepository.save(userSkill);
    return await this.findUserSkill(userId, saved.skill_id);
  }

  async createUserSkillWithNewSkill(userId: string, createUserSkillDto: CreateUserSkillDto): Promise<UserSkill> {
    // Try to find existing skill first
    let skill = await this.skillRepository.findOne({
      where: { name: createUserSkillDto.skill_name },
    });

    // Create skill if it doesn't exist
    if (!skill) {
      skill = await this.createSkill({
        name: createUserSkillDto.skill_name,
        category: createUserSkillDto.category,
      });
    }

    // Add skill to user
    return await this.addUserSkill(userId, {
      skill_id: skill.id,
      proficiency: createUserSkillDto.proficiency,
      years: createUserSkillDto.years,
    });
  }

  async updateUserSkill(
    userId: string,
    skillId: string,
    updateUserSkillDto: UpdateUserSkillDto,
  ): Promise<UserSkill> {
    const userSkill = await this.findUserSkill(userId, skillId);
    
    Object.assign(userSkill, updateUserSkillDto);
    await this.userSkillRepository.save(userSkill);
    
    return await this.findUserSkill(userId, skillId);
  }

  async removeUserSkill(userId: string, skillId: string): Promise<void> {
    const userSkill = await this.userSkillRepository.findOne({
      where: { user_id: userId, skill_id: skillId },
    });

    if (!userSkill) {
      throw new NotFoundException('User skill not found');
    }

    await this.userSkillRepository.remove(userSkill);
  }

  async bulkCreateUserSkills(userId: string, skillsData: CreateUserSkillDto[]): Promise<UserSkill[]> {
    const results: UserSkill[] = [];
    
    for (const skillData of skillsData) {
      try {
        const userSkill = await this.createUserSkillWithNewSkill(userId, skillData);
        results.push(userSkill);
      } catch (error) {
        // Continue with other skills even if one fails
        console.warn(`Failed to create skill ${skillData.skill_name}:`, error.message);
      }
    }

    return results;
  }

  async removeAllUserSkills(userId: string): Promise<void> {
    await this.userSkillRepository.delete({ user_id: userId });
  }
}