import { Trim } from 'class-sanitizer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @Trim()
  fullname: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
