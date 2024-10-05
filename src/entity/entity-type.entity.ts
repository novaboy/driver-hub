// src/entities/entity-type.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EntityMaster } from './entity-master.entity';

@Entity('qr_entity_type_master')
export class EntityType {
  @PrimaryGeneratedColumn()
  entity_type_id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  entity_type: string;

  @OneToMany(() => EntityMaster, (entityMaster) => entityMaster.entityType)
  entities: EntityMaster[];
}
