import { Trim } from 'class-sanitizer';
import { IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Trim()
  fullname: string;

  @IsString()
  @MinLength(6)
  password: string;
}
