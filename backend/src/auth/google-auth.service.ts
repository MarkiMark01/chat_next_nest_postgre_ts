import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';
import type { User } from '@prisma/client';
import { UsersService } from '../users/users.service';

@Injectable()
export class GoogleAuthService {
  private client: OAuth2Client;

  constructor(private usersService: UsersService) {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async validateGoogleToken(token: string): Promise<Omit<User, 'password'> | null> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload?.email || payload.email_verified !== true) {
        return null;
      }

      const email = payload.email.toLowerCase();
      let user = await this.usersService.findByEmail(email);

      if (!user) {
        user = await this.usersService.createUser({
          email,
          name: payload.name,
          password: await bcrypt.hash(randomUUID(), 10),
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
