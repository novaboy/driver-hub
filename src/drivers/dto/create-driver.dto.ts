// src/drivers/dto/create-driver.dto.ts

import {
  IsString,
  IsOptional,
  IsEmail,
  IsDateString,
  IsArray,
  ValidateNested,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePanDetailDto } from '../dto/create-pan-detail.dto';

export class CreateDriverDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  license_number: string;

  @IsOptional()
  @IsString()
  contact_number?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsDateString()
  date_of_birth?: Date;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreatePanDetailDto)
  pan_details: CreatePanDetailDto[];
}
