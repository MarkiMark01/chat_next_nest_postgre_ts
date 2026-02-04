import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import type { User } from '@prisma/client';

@Injectable()
export class GoogleAuthService {
  private client: OAuth2Client;

  constructor(private usersService: UsersService) {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async validateGoogleToken(
    token: string,
  ): Promise<Omit<User, 'password'> | null> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload?.email || payload.email_verified !== true) {
        return null;
      }

      let user = await this.usersService.findByEmail(payload.email);

      if (!user) {
        user = await this.usersService.createUser({
          email: payload.email,
          name: payload.name,
          password: await bcrypt.hash('GOOGLE_AUTH', 10),
        });
      }

      const { password, ...result } = user;
      return result;
    } catch (err) {
      console.error('Google token validation failed:', err);
      return null;
    }
  }
}
