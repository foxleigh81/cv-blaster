import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';
import { CVTemplatesModule } from './cv-templates/cv-templates.module';
import { CVModule } from './cv/cv.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProfileModule,
    CVTemplatesModule,
    CVModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
