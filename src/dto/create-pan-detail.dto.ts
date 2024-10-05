// src/drivers/dto/create-pan-detail.dto.ts

import { IsString, Matches, IsOptional, IsDateString } from 'class-validator';

export class CreatePanDetailDto {
  @IsString()
  @Matches(/^[0-9]{16}$/, {
    message: 'PAN number must be in the format ABCDE1234F',
  })
  pan: string; // Will be encrypted

  @IsOptional()
  @IsString()
  issued_at?: string;

  @IsOptional()
  @IsDateString()
  issued_date?: Date;
}
