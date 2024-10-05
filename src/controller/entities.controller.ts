// src/controllers/entities.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { EntitiesService } from '../service/entities.service';
import { CreateEntityDto } from '../dto/create-entity.dto';
import { RegisterEntityResponse } from '../dto/register-entity-response.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Entities')
@Controller('entities')
export class EntitiesController {
  constructor(private readonly entitiesService: EntitiesService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new entity and generate QR code' })
  @ApiResponse({
    status: 201,
    description: 'Entity registered successfully with QR code URL.',
    type: RegisterEntityResponse,
  })
  async registerEntity(
    @Body() createEntityDto: CreateEntityDto,
  ): Promise<RegisterEntityResponse> {
    const result = await this.entitiesService.create(createEntityDto);
    return {
      ...result,
      qrCodeUrl: result.qrCodeUrl,
    };
  }

  // Additional endpoints can be added here
}
