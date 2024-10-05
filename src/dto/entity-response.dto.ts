// src/dto/entity-response.dto.ts

import { Expose, Type } from 'class-transformer';
import { PanDetailResponseDto } from './pan-detail-response.dto';

export class EntityResponseDto {
  @Expose()
  entity_id: string;

  @Expose()
  first_name: string;

  @Expose()
  last_name: string;

  @Expose()
  contact_number?: string;

  @Expose()
  email?: string;

  @Expose()
  address?: string;

  @Expose()
  date_of_birth?: Date;

  @Expose()
  entity_type_id: number;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  @Type(() => PanDetailResponseDto)
  pan_details: PanDetailResponseDto[];
}
