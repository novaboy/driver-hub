// src/entities/qh-qr-codes-detail.entity.ts

import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { EntityMaster } from './entity-master.entity';

@Entity('qr_qr_code_details')
export class QRCodeDetail {
  @PrimaryColumn('uuid') //, { name: 'qr_id' })
  qrId: string;

  @OneToOne(() => EntityMaster, (entity) => entity.qrCodeDetail, {
    cascade: ['insert', 'update'], // **Removed 'remove' here**
    nullable: true,
  })
  @JoinColumn({ name: 'entity_id' })
  entity: EntityMaster;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
