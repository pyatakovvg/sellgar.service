
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from '@plugin/type-orm';

import Attribute from './Attribute';
import AttributeGroup from './AttributeGroup';


@Entity('AttributeValue')
class AttributeValue {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('varchar')
  value: string;

  @Column('integer', { default: 0 })
  order: number;


  @ManyToOne(() => AttributeGroup, (group) => group['uuid'], {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  group: AttributeGroup;

  @ManyToOne(() => Attribute, (attribute) => attribute['uuid'])
  @JoinColumn()
  attribute: Attribute;
}

export default AttributeValue;
