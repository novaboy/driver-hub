// src/drivers/drivers.controller.ts

import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { AuthGuard } from '@nestjs/passport'; // Add this import

@Controller('drivers')
export class DriversController {
  private readonly expectedAuthKey: string;

  constructor(private readonly driversService: DriversService) {
    // Retrieve AUTH_KEY from environment variables and encode it in Base64
    const authKey = process.env.AUTH_KEY;
    if (!authKey) {
      throw new Error('AUTH_KEY is not set in environment variables');
    }
    this.expectedAuthKey = Buffer.from(authKey).toString('base64');
  }

  @Post('register')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async registerDriver(
    @Body() createDriverDto: CreateDriverDto,
    @Headers('authorization') authHeader: string,
  ) {
    console.log('Register Endpoint Hit');
    console.log(createDriverDto);

    // Authenticate the request
    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const [authType, authKey] = authHeader.split(' ');

    if (authType !== 'Basic' || authKey !== this.expectedAuthKey) {
      throw new UnauthorizedException('Invalid Authentication credentials');
    }

    // Create driver
    const driver = await this.driversService.create(createDriverDto);

    // Remove sensitive information before sending response
    // return (({ pan_details, ...driverData }) => driverData)(driver);
    return (({ ...driverData }) => driverData)(driver);
  }
}
