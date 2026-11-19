import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import type { User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async register(dto: RegisterDto): Promise<Omit<User, 'password'>> {
    const email = dto.email.trim().toLowerCase();

    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.usersService.createUser({
      email,
      name: dto.name,
      password: await this.hashPassword(dto.password),
    });

    const { password, ...result } = user;
    return result;
  }

  async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email.trim().toLowerCase());
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    const { password: _, ...result } = user;
    return result;
  }

  // Видає JWT. У токені лежить id користувача (sub) та email
  createAuthResponse(user: Omit<User, 'password'>) {
    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });
    return { user, accessToken };
  }
}
