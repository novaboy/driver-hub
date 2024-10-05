import {
  Injectable,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EntityMaster } from '../entity/entity-master.entity';
import { EntityType } from '../entity/entity-type.entity';
import { PanDetail } from '../entity/pan-detail.entity';
import { QRCodeDetail } from '../entity/qr-code-detail.entity';
import { CreateEntityDto } from '../dto/create-entity.dto';
import { QRCodeService } from './qr-code.service';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EntitiesService {
  private readonly encryptionKey: string;
  private readonly baseUrl: string;
  private readonly logger = new Logger(EntitiesService.name);

  constructor(
    @InjectRepository(EntityMaster)
    private entitiesRepository: Repository<EntityMaster>,

    @InjectRepository(EntityType)
    private entityTypesRepository: Repository<EntityType>,

    @InjectRepository(PanDetail)
    private panDetailsRepository: Repository<PanDetail>,

    @InjectRepository(QRCodeDetail)
    private qrCodeDetailsRepository: Repository<QRCodeDetail>,

    private qrCodeService: QRCodeService,

    private configService: ConfigService,
  ) {
    // Retrieve encryption key from environment variables
    this.encryptionKey = this.configService.get<string>('ENCRYPTION_KEY');
    if (!this.encryptionKey) {
      throw new BadRequestException(
        'ENCRYPTION_KEY is not set in environment variables',
      );
    }

    // Retrieve base URL from environment variables
    this.baseUrl = this.configService.get<string>('BASE_URL');
    if (!this.baseUrl) {
      throw new BadRequestException(
        'BASE_URL is not set in environment variables',
      );
    }
  }

  // Encryption function using AES-256-CBC
  encrypt(text: string): string {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(
        'aes-256-cbc',
        Buffer.from(this.encryptionKey, 'hex'),
        iv,
      );
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
      this.logger.error('Encryption failed:', error);
      throw new BadRequestException('Failed to encrypt PAN number.');
    }
  }

  // Decryption function (optional)
  decrypt(text: string): string {
    try {
      const textParts = text.split(':');
      const iv = Buffer.from(textParts.shift()!, 'hex');
      const encryptedText = Buffer.from(textParts.join(':'), 'hex');
      const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        Buffer.from(this.encryptionKey, 'hex'),
        iv,
      );
      let decrypted = decipher.update(encryptedText, undefined, 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      this.logger.error('Decryption failed:', error);
      throw new BadRequestException('Failed to decrypt PAN number.');
    }
  }

  // Function to mask PAN
  private maskPan(pan: string): string {
    if (!pan || pan.length < 10) {
      // Assuming standard PAN length is 10
      throw new BadRequestException('Invalid PAN format for masking');
    }
    const first4 = pan.slice(0, 4);
    const last4 = pan.slice(-4);
    const maskedMiddle = '*'.repeat(pan.length - 8);
    return first4 + maskedMiddle + last4;
  }

  async create(createEntityDto: CreateEntityDto): Promise<any> {
    try {
      // Validate entity_type_id
      const entityType = await this.entityTypesRepository.findOne({
        where: { entity_type_id: createEntityDto.entity_type_id },
      });

      if (!entityType) {
        throw new BadRequestException('Invalid entity_type_id provided');
      }

      // Encrypt PAN numbers and generate masked_pan
      const encryptedPanDetails =
        createEntityDto.pan_details?.map((pan) => ({
          pan: this.encrypt(pan.pan),
          masked_pan: this.maskPan(pan.pan),
          issued_at: pan.issued_at,
          issued_date: pan.issued_date,
        })) || [];

      // Create entity with encrypted PAN details
      const entity = this.entitiesRepository.create({
        first_name: createEntityDto.first_name,
        last_name: createEntityDto.last_name,
        contact_number: createEntityDto.contact_number,
        email: createEntityDto.email,
        address: createEntityDto.address,
        date_of_birth: createEntityDto.date_of_birth,
        entityType: entityType,
        pan_details: encryptedPanDetails.map((panDetail) =>
          this.panDetailsRepository.create(panDetail),
        ),
      });

      // Save the entity to obtain the entity ID
      const savedEntity = await this.entitiesRepository.save(entity);
      this.logger.log(`Entity created with ID: ${savedEntity.entity_id}`);

      // Generate QR Code URL
      const { qrCodeId, qrCodeUrl } =
        await this.qrCodeService.generateQRCodeUrl(
          this.baseUrl,
          savedEntity.entity_id,
        );

      // Create a record in qr_qr_code_details table
      const qrCodeRecord = this.qrCodeDetailsRepository.create({
        qrId: qrCodeId,
        entity: savedEntity,
        isActive: true,
      });

      await this.qrCodeDetailsRepository.save(qrCodeRecord);
      this.logger.log(`QR CodeDetail created with QR ID: ${qrCodeId}`);

      // Return the saved entity details along with the QR Code URL
      // You might want to omit sensitive information here
      const { ...entityData } = savedEntity; // Exclude PAN details

      return {
        ...entityData,
        qrCodeUrl,
      };
    } catch {
      // Log error if necessary
      throw new InternalServerErrorException('Failed to create entity');
    }

    // Additional service methods (e.g., find, update, delete) can be added here
  }
}
