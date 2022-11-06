
import {
  Index,
  Entity,
  Column,
  OneToOne,
  ManyToOne,
  JoinTable,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from '@plugin/type-orm';

import Group from './Group';
import Store from './Store';
import Comment from './Comment';
import Category from './Category';
import CatalogImage from './CatalogImage';
import AttributeGroup from './AttributeGroup';


@Entity('Catalog')
class Catalog {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Index()
  @Column('varchar', { nullable: true, unique: true })
  externalId: string;

  @Index({ fulltext: true })
  @Column('varchar', { nullable: false, default: '' })
  name: string;

  @Index({ fulltext: true })
  @Column('varchar', { nullable: true })
  description: string;

  @Column('boolean', { default: false })
  isUse: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


  @ManyToOne(() => Group, (group) => group['code'], {
    onDelete: 'SET NULL',
    orphanedRowAction: 'nullify',
  })
  @JoinColumn()
  group: Group;

  @ManyToOne(() => Category, (category) => category['code'], {
    onDelete: 'SET NULL',
    orphanedRowAction: 'nullify',
  })
  @JoinColumn()
  category: Category;

  @OneToMany(() => AttributeGroup, (group) => group['catalog'], {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  attributes: AttributeGroup[];

  @OneToMany(() => CatalogImage, (image) => image['catalog'], {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  images: CatalogImage[];

  @OneToOne(() => Store, (product) => product['uuid'], {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  product: Store;

  @OneToMany(() => Comment, (comment) => comment['catalog'], {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  comments: Comment[];
}

export default Catalog;
