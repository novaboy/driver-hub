// src/qr-code/qr-code.service.ts

import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs/promises';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QRCodeService {
  private readonly qrImagesDir: string;
  private readonly logger = new Logger(QRCodeService.name);

  constructor(private configService: ConfigService) {
    this.qrImagesDir = path.join(process.cwd(), 'public', 'qr-codes');
    this.ensureDirectoryExists();
  }

  private async ensureDirectoryExists() {
    try {
      await fs.access(this.qrImagesDir);
    } catch {
      await fs.mkdir(this.qrImagesDir, { recursive: true });
      this.logger.log(`Created QR codes directory at ${this.qrImagesDir}`);
    }
  }

  async generateQRCodeUrl(
    baseUrl: string,
    entityId: string, // Now used within the method
  ): Promise<{ qrCodeId: string; qrCodeUrl: string }> {
    const qrCodeId = uuidv4(); // Generate a unique and unpredictable ID
    const qrCodeFilename = `qr_${qrCodeId}.jpg`;
    const qrCodePath = `/public/qr-codes/${qrCodeFilename}`;
    const fullUrl = `${baseUrl}${qrCodePath}`;

    // QR Code Data containing the verification URL with entityId
    const qrDataUrl = `${baseUrl}/verify?qrCodeId=${qrCodeId}&entityId=${entityId}`;

    try {
      const qrBuffer = await QRCode.toBuffer(qrDataUrl, { type: 'jpeg' });
      const filePath = path.join(this.qrImagesDir, qrCodeFilename);
      await fs.writeFile(filePath, qrBuffer);
      this.logger.log(
        `Generated QR code for Entity ID: ${entityId} at ${filePath}`,
      );
    } catch (error) {
      this.logger.error('QR Code generation failed:', error);
      throw new HttpException(
        'QR Code generation failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { qrCodeId, qrCodeUrl: fullUrl };
  }
}
