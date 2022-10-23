
import { Index, Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from '@plugin/type-orm';

import Group from './Group';
import Category from './Category';
import CatalogImage from './CatalogImage';
import CatalogProduct from './CatalogProduct';
import AttributeGroup from './AttributeGroup';


@Entity('Catalog')
class Catalog {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Index()
  @Column('varchar', { nullable: true, unique: true })
  externalId: string;

  @Column('varchar', { nullable: false, default: '' })
  name: string;

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

  @OneToMany(() => AttributeGroup, (group) => group['products'], {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  attributes: AttributeGroup[];

  @OneToMany(() => CatalogImage, (image) => image['product'], {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  images: CatalogImage[];

  @OneToMany(() => CatalogProduct, (product) => product['catalog'], {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  products: CatalogProduct[];
}

export default Catalog;
