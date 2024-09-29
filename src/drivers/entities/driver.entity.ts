// src/drivers/entities/driver.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PanDetail } from '../entities/pan-detail.entity';

@Entity('dh_driver_master')
export class Driver {
  @PrimaryGeneratedColumn()
  driver_id: number;

  @Column({ length: 100 })
  first_name: string;

  @Column({ length: 100 })
  last_name: string;

  @Column({ length: 50, unique: true, nullable: true })
  license_number: string;

  @Column({ length: 15, nullable: true })
  contact_number: string;

  @Column({ length: 100, nullable: true, unique: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => PanDetail, (panDetail) => panDetail.driver, {
    cascade: true, // Enables cascading operations
    eager: true, // Automatically loads PanDetails when fetching a Driver
  })
  pan_details: PanDetail[];
}
