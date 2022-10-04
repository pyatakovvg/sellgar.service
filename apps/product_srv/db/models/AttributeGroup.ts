
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinTable,
  JoinColumn,
  OneToMany
} from '@plugin/type-orm';

import Product from './Product';
import AttributeValue from './AttributeValue';


@Entity('AttributeGroup')
class AttributeGroup {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('varchar')
  name: string;

  @Column('integer', { default: 0 })
  order: number;


  @ManyToOne(() => Product, (product) => product['uuid'], {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  products: Product;

  @OneToMany(() => AttributeValue, (attribute) => attribute['group'], {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  values: AttributeValue[];
}

export default AttributeGroup;
