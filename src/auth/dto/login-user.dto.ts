import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
