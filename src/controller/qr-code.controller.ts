// src/qr-code/qr-code.controller.ts

import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { QRCodeDetail } from '../entity/qr-code-detail.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';

@Controller('verify')
export class QRCodeController {
  private readonly logger = new Logger(QRCodeController.name);

  constructor(
    @InjectRepository(QRCodeDetail)
    private qrCodeDetailsRepository: Repository<QRCodeDetail>,
  ) {}

  @Get()
  async verifyQRCode(
    @Query('qrCodeId') qrCodeId: string,
    @Query('entityId') entityId: string,
  ): Promise<any> {
    if (!qrCodeId || !entityId) {
      throw new HttpException(
        'Missing qrCodeId or entityId',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const qrCodeDetail = await this.qrCodeDetailsRepository.findOne({
        where: {
          qrId: qrCodeId,
          entity: { entity_id: entityId },
          isActive: true,
        },
        relations: ['entity'],
      });

      if (!qrCodeDetail) {
        throw new HttpException(
          'Invalid or inactive QR Code',
          HttpStatus.NOT_FOUND,
        );
      }

      // Perform necessary verification logic here
      // For example, activate the QR code, mark entity as verified, etc.

      this.logger.log(
        `Verified QR Code: ${qrCodeId} for Entity ID: ${entityId}`,
      );

      return {
        message: 'QR Code verified successfully',
        entity: qrCodeDetail.entity,
      };
    } catch (error) {
      this.logger.error('QR Code verification failed:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
