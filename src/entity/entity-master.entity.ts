// src/entities/entity-master.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityType } from './entity-type.entity';
import { PanDetail } from './pan-detail.entity';
import { QRCodeDetail } from './qr-code-detail.entity';

@Entity('qr_entity_master')
export class EntityMaster {
  @PrimaryGeneratedColumn('uuid')
  entity_id: string; // Renamed from driver_id

  @Column({ type: 'varchar', length: 100 })
  first_name: string;

  @Column({ type: 'varchar', length: 100 })
  last_name: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  contact_number?: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  email?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth?: Date;

  @ManyToOne(() => EntityType, (entityType) => entityType.entities, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  entityType: EntityType;

  @OneToMany(() => PanDetail, (panDetail) => panDetail.entity, {
    cascade: true,
  })
  pan_details: PanDetail[];

  @OneToOne(() => QRCodeDetail, (qrCode) => qrCode.entity, {
    cascade: ['insert', 'update', 'remove'], // Retain 'remove' here
    nullable: true,
  })
  qrCodeDetail: QRCodeDetail;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
