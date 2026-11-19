import { Body, Controller, HttpCode, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthService } from './google-auth.service';
import { GoogleLoginDto, LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private googleAuthService: GoogleAuthService,
  ) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  // Повертає { user, accessToken }
  @HttpCode(200)
  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      // Раніше було return { error }, тобто статус 200 навіть при помилці
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.authService.createAuthResponse(user);
  }

  @HttpCode(200)
  @Post('google-login')
  async googleLogin(@Body() body: GoogleLoginDto) {
    const user = await this.googleAuthService.validateGoogleToken(body.token);
    if (!user) {
      throw new UnauthorizedException('Google validation failed');
    }
    return this.authService.createAuthResponse(user);
  }
}

