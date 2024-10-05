// src/dto/queryqrcode-response.dto.ts

export class QueryQRCodeResponseDto {
  firstName: string;
  lastName: string;
  pans: {
    panNumber: string;
    bankName: string;
  }[];
}
