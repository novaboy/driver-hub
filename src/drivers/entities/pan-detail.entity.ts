// src/drivers/entities/pan-detail.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Driver } from './driver.entity';

@Entity('dh_pan_details')
export class PanDetail {
  @PrimaryGeneratedColumn()
  pan_id: number;

  @Column()
  driver_id: number;

  @Column({ type: 'text' })
  pan: string; // Encrypted PAN number

  @Column({ length: 100, nullable: true })
  issued_at: string;

  @Column({ type: 'date', nullable: true })
  issued_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Driver, (driver) => driver.pan_details, {
    onDelete: 'CASCADE',
  })
  driver: Driver;
}
