import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';
import { Driver } from './entities/driver.entity';
import { PanDetail } from './entities/pan-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Driver, PanDetail])],
  controllers: [DriversController],
  providers: [DriversService],
})
export class DriversModule {}
