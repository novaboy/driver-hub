// src/drivers/drivers.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './entities/driver.entity';
import { PanDetail } from './entities/pan-detail.entity';
import { CreateDriverDto } from './dto/create-driver.dto';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DriversService {
  private readonly encryptionKey: string;

  constructor(
    @InjectRepository(Driver)
    private driversRepository: Repository<Driver>,
    @InjectRepository(PanDetail)
    private panDetailsRepository: Repository<PanDetail>,
    private configService: ConfigService,
  ) {
    // Retrieve encryption key from environment variables
    this.encryptionKey = this.configService.get<string>('ENCRYPTION_KEY');
    if (!this.encryptionKey) {
      throw new BadRequestException(
        'ENCRYPTION_KEY is not set in environment variables',
      );
    }
  }

  // Encryption function using AES-256-CBC
  encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(this.encryptionKey, 'hex'),
      iv,
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  // Decryption function (optional)
  decrypt(text: string): string {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(this.encryptionKey, 'hex'),
      iv,
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }

  async create(createDriverDto: CreateDriverDto): Promise<Driver> {
    // Encrypt PAN numbers
    const encryptedPanDetails = createDriverDto.pan_details.map((pan) => ({
      apn: this.encrypt(pan.apn),
      issued_at: pan.issued_at,
      issued_date: pan.issued_date,
    }));

    // Create driver entity with encrypted PAN details
    const driver = this.driversRepository.create({
      ...createDriverDto,
      pan_details: encryptedPanDetails,
    });

    return await this.driversRepository.save(driver);
  }
}
