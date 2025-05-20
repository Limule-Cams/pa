import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { UserTokenDto } from './dto/user-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginRequestDto): Promise<UserTokenDto> {
    return await this.authService.login(loginDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(
    @Body() registerDto: any,
  ): Promise<{ providerId: number; message: string } | void> {
    return await this.authService.register(registerDto);
  }
}
