
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinTable,
  ManyToMany
} from '@plugin/type-orm';

import Image from "./Image";
import Product from './Product';
import Category from './Category';


@Entity('Group')
class Group {
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


  @OneToMany(() => Category, (category) => category['group'])
  @JoinTable()
  categories: Category[];

  @OneToMany(() => Product, (product) => product['group'])
  @JoinTable()
  products: Product[];

  @ManyToMany(() => Image, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinTable()
  images: Image[];
}

export default Group;
