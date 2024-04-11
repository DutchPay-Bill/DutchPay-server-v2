import { Trim } from 'class-sanitizer';
import { Transform } from 'class-transformer';
import { IsDate, IsEmail, IsString } from 'class-validator';
export class ProfileDto {
  @IsString()
  @Trim()
  username: string;

  @IsString()
  password: string;

  @IsString()
  @Trim()
  fullname: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  phone_number: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Trim()
  bio: string;

  @IsDate()
  dob: Date;

  @IsString()
  @Trim()
  photo_profile: string;
}
