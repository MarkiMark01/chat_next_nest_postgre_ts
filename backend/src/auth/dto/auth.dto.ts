import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  // bcrypt працює максимум з 72 байтами
  @IsString()
  @MinLength(6)
  @MaxLength(72)
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class GoogleLoginDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}