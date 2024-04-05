import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
export class PhoneDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  phone_number: string;
}
