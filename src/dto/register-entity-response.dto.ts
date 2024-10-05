// src/dto/register-entity-response.dto.ts

export class RegisterEntityResponse {
  entity_id: string;
  first_name: string;
  last_name: string;
  contact_number?: string;
  email?: string;
  address?: string;
  date_of_birth?: Date;
  entityType: string; // Adjust based on your EntityType structure
  created_at: Date;
  updated_at: Date;
  qrCodeUrl: string;
}
