import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  for (const user of users) {
    if (await bcrypt.compare('GOOGLE_AUTH', user.password)) {
      await prisma.user.update({
        where: { id: user.id },
        data: { password: await bcrypt.hash(randomUUID(), 10) },
      });
      console.log('Fixed:', user.email);
    }
  }
}

main().finally(() => prisma.$disconnect());