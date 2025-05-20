import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from './jwt/jwt.config';
import { CommonModule } from '../common/common.module';
import { CoreModule } from '../core/core.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../common/entity/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt.strategy';
import { AdminModule } from '../modules/admin/admin.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(jwtConfig),
    CoreModule,
    CommonModule,
    TypeOrmModule.forFeature([UserEntity]),
    AdminModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
