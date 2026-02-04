import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import type { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: { email: string; password: string; name?: string }): Promise<User> {
    return this.prisma.user.create({ data });
  }
}



