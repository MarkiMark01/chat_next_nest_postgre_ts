import { Controller, Post, Body } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';

@Controller('auth/google')
export class GoogleAuthController {
  constructor(private googleAuthService: GoogleAuthService) {}

  @Post('login')
  async login(@Body() body: { token: string }) {
    const user = await this.googleAuthService.validateGoogleToken(body.token);

    if (!user) {
      return { error: 'Invalid Google token' };
    }

    return user;
  }
}

