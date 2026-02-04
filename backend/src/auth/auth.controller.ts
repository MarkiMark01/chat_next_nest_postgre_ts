import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { GoogleAuthService } from './google-auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private googleAuthService: GoogleAuthService,
  ) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string; name?: string }) {
    if (body.password.length < 6) {
      return { error: 'Password must be at least 6 characters' };
    }
    const hashedPassword = await this.authService.hashPassword(body.password);
    const user = await this.usersService.createUser({
      ...body,
      password: hashedPassword,
    });
    const { password, ...result } = user;
    return result;
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      return { error: 'Invalid credentials' };
    }
    return user;
  }

  @Post('google-login')
  async googleLogin(@Body() body: { token: string }) {
    const user = await this.googleAuthService.validateGoogleToken(body.token);
    if (!user) {
      throw new UnauthorizedException('Google validation failed');
    }
    return user;
  }
}

