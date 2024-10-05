import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QRCodeService } from './service/qr-code.service';
import { QRCodeDetail } from './entity/qr-code-detail.entity';
import { QRCodeController } from './controller/qr-code.controller';

@Module({
  imports: [TypeOrmModule.forFeature([QRCodeService, QRCodeDetail])],
  providers: [QRCodeService],
  exports: [QRCodeService],
  controllers: [QRCodeController],
})
export class QRCodeModule {}
