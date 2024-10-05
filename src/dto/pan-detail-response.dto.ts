// src/dto/pan-detail-response.dto.ts

import { Expose, Exclude } from 'class-transformer';

export class PanDetailResponseDto {
  @Expose()
  pan_id: number;

  @Expose()
  entity_id: string;

  @Expose()
  masked_pan: string;

  @Expose()
  issued_date?: Date;

  @Expose()
  issued_at?: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Exclude()
  pan: string; // Exclude the encrypted PAN
}
