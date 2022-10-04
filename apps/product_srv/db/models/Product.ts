
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from '@plugin/type-orm';

import Group from './Group';
import Brand from './Brand';
import Category from './Category';
import Currency from "./Currency";
import ProductImage from "./ProductImage";
import AttributeGroup from './AttributeGroup';


@Entity('Product')
class Product {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('varchar', { nullable: true, unique: true })
  externalId: string;

  @Column('varchar', { nullable: true })
  title: string;

  @Column('varchar', { nullable: true })
  description: string;

  @Column('numeric', { precision: 10, scale: 2, default: 0 })
  price: number;

  @ManyToOne(() => Currency, (currency) => currency['code'])
  @JoinColumn()
  currency: Currency;

  @Column('boolean', { default: false })
  isUse: boolean;

  @Column('boolean', { default: false })
  isAvailable: boolean;

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

  @ManyToOne(() => Brand, (brand) => brand['uuid'], {
    onDelete: 'SET NULL',
    orphanedRowAction: 'nullify',
  })
  @JoinColumn()
  brand: Brand;

  @OneToMany(() => AttributeGroup, (group) => group['products'], {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  attributes: AttributeGroup[];

  @OneToMany(() => ProductImage, (image) => image['product'], {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  images: ProductImage[];
}

export default Product;
