# NestJS Implementation Patterns for CV Blaster

## Common Patterns & Best Practices

### 1. Module Structure Pattern
```typescript
// Standard module structure
@Module({
  imports: [
    TypeOrmModule.forFeature([Entity1, Entity2]),
    CommonModule,
  ],
  controllers: [FeatureController],
  providers: [FeatureService, FeatureRepository],
  exports: [FeatureService], // Export if needed by other modules
})
export class FeatureModule {}
```

### 2. Entity with Base Audit Fields
```typescript
// base.entity.ts
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}

// feature.entity.ts
@Entity('features')
export class Feature extends BaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => User, user => user.features)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;
}
```

### 3. DTO with Validation Pattern
```typescript
// create-feature.dto.ts
export class CreateFeatureDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsArray()
  @IsOptional()
  @ArrayMaxSize(10)
  tags?: string[];
}

// update-feature.dto.ts
export class UpdateFeatureDto extends PartialType(CreateFeatureDto) {}
```

### 4. Service with Repository Pattern
```typescript
@Injectable()
export class FeatureService {
  constructor(
    @InjectRepository(Feature)
    private featureRepository: Repository<Feature>,
  ) {}

  async findAll(userId: string): Promise<Feature[]> {
    return this.featureRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async create(userId: string, dto: CreateFeatureDto): Promise<Feature> {
    const feature = this.featureRepository.create({
      ...dto,
      userId,
    });
    return this.featureRepository.save(feature);
  }

  async update(id: string, userId: string, dto: UpdateFeatureDto): Promise<Feature> {
    const feature = await this.findOneOrFail(id, userId);
    Object.assign(feature, dto);
    return this.featureRepository.save(feature);
  }

  private async findOneOrFail(id: string, userId: string): Promise<Feature> {
    const feature = await this.featureRepository.findOne({
      where: { id, userId },
    });
    if (!feature) {
      throw new NotFoundException('Feature not found');
    }
    return feature;
  }
}
```

### 5. Controller with Guards Pattern
```typescript
@Controller('api/features')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Features')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Get()
  @ApiOperation({ summary: 'Get all features' })
  @ApiResponse({ status: 200, description: 'Return all features' })
  async findAll(@CurrentUser() user: User): Promise<Feature[]> {
    return this.featureService.findAll(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a feature' })
  @ApiResponse({ status: 201, description: 'Feature created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @CurrentUser() user: User,
    @Body() dto: CreateFeatureDto,
  ): Promise<Feature> {
    return this.featureService.create(user.id, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a feature' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateFeatureDto,
  ): Promise<Feature> {
    return this.featureService.update(id, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a feature' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.featureService.delete(id, user.id);
  }
}
```

### 6. JWT Strategy Pattern
```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
```

### 7. Custom Decorator Pattern
```typescript
// current-user.decorator.ts
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

// roles.decorator.ts
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
```

### 8. Exception Filter Pattern
```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? exception.getResponse()
      : 'Internal server error';

    response.status(status).json({
      success: false,
      error: {
        code: status,
        message: message,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    });
  }
}
```

### 9. Configuration Pattern
```typescript
// config/database.config.ts
export const databaseConfig = registerAs('database', () => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
}));

// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test'),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().default(5432),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => 
        configService.get('database'),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### 10. Testing Pattern
```typescript
// feature.service.spec.ts
describe('FeatureService', () => {
  let service: FeatureService;
  let repository: Repository<Feature>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeatureService,
        {
          provide: getRepositoryToken(Feature),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<FeatureService>(FeatureService);
    repository = module.get<Repository<Feature>>(
      getRepositoryToken(Feature),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of features', async () => {
      const expectedFeatures = [{ id: '1', name: 'Test' }];
      mockRepository.find.mockResolvedValue(expectedFeatures);

      const result = await service.findAll('user-id');
      expect(result).toEqual(expectedFeatures);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user-id' },
        order: { createdAt: 'DESC' },
      });
    });
  });
});
```

### 11. Pagination Pattern
```typescript
// pagination.dto.ts
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

// paginated.response.ts
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// service implementation
async findAllPaginated(
  userId: string,
  paginationDto: PaginationDto,
): Promise<PaginatedResponse<Feature>> {
  const { page, limit } = paginationDto;
  const skip = (page - 1) * limit;

  const [data, total] = await this.featureRepository.findAndCount({
    where: { userId },
    skip,
    take: limit,
    order: { createdAt: 'DESC' },
  });

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
```

### 12. Transaction Pattern
```typescript
async createWithRelations(dto: CreateFeatureDto): Promise<Feature> {
  const queryRunner = this.connection.createQueryRunner();
  
  await queryRunner.connect();
  await queryRunner.startTransaction();
  
  try {
    const feature = await queryRunner.manager.save(Feature, dto.feature);
    const relations = await queryRunner.manager.save(
      Relation, 
      dto.relations.map(r => ({ ...r, featureId: feature.id }))
    );
    
    await queryRunner.commitTransaction();
    return feature;
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
}
```

## Common NestJS Commands

```bash
# Generate resources
nest g module features
nest g controller features
nest g service features
nest g class features/dto/create-feature.dto
nest g class features/entities/feature.entity

# Running the application
npm run start:dev     # Development with watch
npm run start:debug   # Debug mode
npm run start:prod    # Production

# Testing
npm run test          # Unit tests
npm run test:watch    # Watch mode
npm run test:cov      # Coverage
npm run test:e2e      # E2E tests

# Database
npm run migration:generate -- -n MigrationName
npm run migration:run
npm run migration:revert
```

## Security Best Practices

1. **Always validate input** using class-validator
2. **Use parameterized queries** to prevent SQL injection
3. **Implement rate limiting** with @nestjs/throttler
4. **Use helmet** for security headers
5. **Sanitize output** to prevent XSS
6. **Implement CORS** properly
7. **Use environment variables** for secrets
8. **Implement proper logging** without sensitive data
9. **Use HTTPS** in production
10. **Keep dependencies updated**