import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { GoogleAuthService } from './google-auth.service';
import { GoogleAuthController } from './google-auth.controller';
import { MyAuthGuard } from './auth.guard';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.NEXTAUTH_SECRET, 
      signOptions: { expiresIn: '1d' }, 
    }),
  ],
  providers: [AuthService, GoogleAuthService, MyAuthGuard],
  controllers: [AuthController, GoogleAuthController],
  exports: [AuthService, MyAuthGuard, JwtModule],
})
export class AuthModule {}



