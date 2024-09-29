// src/drivers/entities/pan-detail.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Driver } from './driver.entity';

@Entity('dh_pan_details')
export class PanDetail {
  @PrimaryGeneratedColumn()
  pan_id: number;

  @Column()
  driver_id: number;

  @Column({ type: 'text', nullable: false })
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
    nullable: false, // Ensures driver_id cannot be null
    onDelete: 'CASCADE', // Optional: Specifies behavior on driver deletion
  })
  @JoinColumn({ name: 'driver_id' }) // Specifies the foreign key column
  driver: Driver;
}
