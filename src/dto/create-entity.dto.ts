// src/dto/create-entity.dto.ts

import {
  IsString,
  IsOptional,
  IsEmail,
  IsDateString,
  IsInt,
  Min,
  ValidateNested,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePanDetailDto } from './create-pan-detail.dto';

export class CreateEntityDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

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

  @IsInt()
  @Min(1)
  entity_type_id: number; // Reference to EntityType

  @IsOptional()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreatePanDetailDto)
  pan_details?: CreatePanDetailDto[];
}
