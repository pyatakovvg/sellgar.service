
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinTable,
  OneToMany, ManyToMany,
} from '@plugin/type-orm';

import Image from "./Image";
import Group from './Group';
import Product from "./Product";


@Entity('Category')
class Category {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('varchar', { unique: true })
  code: string;

  @Column('varchar', { unique: true })
  name: string;

  @Column('varchar', { nullable: true })
  description: string;

  @Column('varchar', { nullable: true })
  icon: string;

  @Column('integer', { default: 999999 })
  order: number;


  @ManyToOne(() => Group, (group) => group['uuid'], {
    onDelete: 'SET NULL',
    orphanedRowAction: 'nullify',
  })
  @JoinTable()
  group: Group;

  @ManyToMany(() => Image, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinTable()
  images: Image[];

  @OneToMany(() => Product, (product) => product['category'])
  products: Product[];
}

export default Category;
