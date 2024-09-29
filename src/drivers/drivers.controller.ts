// src/drivers/drivers.controller.ts

import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post('register')
  @UseGuards(AuthGuard('basic'))
  @HttpCode(HttpStatus.CREATED)
  async registerDriver(@Body() createDriverDto: CreateDriverDto) {
    console.log('Register Endpoint Hit');
    console.log(createDriverDto);

    // Create driver
    const driver = await this.driversService.create(createDriverDto);

    // Remove sensitive information before sending response
    const { pan_details, ...driverData } = driver;
    return driverData;
  }

  // Optional: Other endpoints without authentication
  // @Get()
  // getAllDrivers() {
  //   return this.driversService.findAll();
  // }
}
