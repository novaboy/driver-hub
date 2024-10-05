import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntitiesService } from './service/entities.service';
import { EntityMaster } from './entity/entity-master.entity';
import { EntityType } from './entity/entity-type.entity';
import { PanDetail } from './entity/pan-detail.entity';
import { QRCodeDetail } from './entity/qr-code-detail.entity';
import { QRCodeService } from './service/qr-code.service';
import { EntitiesController } from './controller/entities.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EntityMaster,
      EntityType,
      PanDetail,
      QRCodeDetail,
    ]),
  ],
  controllers: [EntitiesController],
  providers: [EntitiesService, QRCodeService],
  exports: [EntitiesService],
})
export class EntitiesModule {}
