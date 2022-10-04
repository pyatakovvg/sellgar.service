
import { Entity, Column, PrimaryGeneratedColumn, JoinTable, OneToMany, ManyToMany } from '@plugin/type-orm';

import Image from './Image';
import Product from "./Product";


@Entity('Brand')
class Brand {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('varchar')
  code: string;

  @Column('varchar', { unique: true })
  name: string;

  @Column('varchar', { nullable: true })
  description: string;

  @Column('integer', { default: 999999 })
  order: string;


  @ManyToMany(() => Image, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinTable()
  images: Image[];

  @OneToMany(() => Product, (product) => product['brand'])
  products: Product[];
}

export default Brand;
