
import { Index, Entity, Column, PrimaryGeneratedColumn, JoinTable, OneToMany, ManyToMany } from '@plugin/type-orm';

import Image from './Image';
import Store from "./Store";


@Entity('Brand')
class Brand {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Index()
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

  @OneToMany(() => Store, (product) => product['brand'])
  products: Store[];
}

export default Brand;
