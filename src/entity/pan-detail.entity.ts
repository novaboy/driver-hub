// src/entities/pan-detail.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { EntityMaster } from './entity-master.entity';

@Entity('qr_pan_details')
export class PanDetail {
  @PrimaryGeneratedColumn()
  pan_id: number; // Auto-incrementing integer

  @Column({ type: 'uuid' })
  entity_id: string; // Renamed from driver_id

  @Column({ type: 'text' })
  pan: string; // Encrypted PAN number

  @Column({ type: 'varchar', length: 16 })
  masked_pan: string; // Masked PAN

  @Column({ type: 'date', nullable: true })
  issued_date?: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  issued_at?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => EntityMaster, (entityMaster) => entityMaster.pan_details, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'entity_id' })
  entity: EntityMaster;
}
