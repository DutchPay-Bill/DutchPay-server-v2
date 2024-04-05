import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Trim()
  fullname: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
