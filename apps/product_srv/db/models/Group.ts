
import {
  Index,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinTable,
  ManyToMany
} from '@plugin/type-orm';

import Image from './Image';
import Catalog from './Catalog';
import Category from './Category';


@Entity('Group')
class Group {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Index()
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

  @OneToMany(() => Catalog, (product) => product['group'])
  @JoinTable()
  catalogs: Catalog[];

  @ManyToMany(() => Image, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinTable()
  images: Image[];
}

export default Group;
