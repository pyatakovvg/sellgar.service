
import {Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany, JoinTable} from '@plugin/type-orm';

import Image from './Image';
import Currency from "./Currency";
import BucketProduct from "./BucketProduct";
import CheckoutProduct from "./CheckoutProduct";


@Entity('Product')
class Product {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('varchar', { nullable: true, unique: true })
  externalId: string;

  @Column('varchar', { nullable: true })
  title: string;

  @Column('varchar', { nullable: true, default: null })
  groupCode: string;

  @Column('varchar', { nullable: true, default: null })
  categoryCode: string;

  @Column('varchar', { nullable: true, unique: true })
  vendor: string;

  @Column('numeric', { precision: 10, scale: 2, default: 0 })
  price: number;


  @ManyToOne(() => Currency, (currency) => currency['code'])
  @JoinColumn()
  currency: Currency;

  @ManyToOne(() => Image, (image) => image['uuid'])
  @JoinColumn()
  image: Image;

  @OneToMany(() => BucketProduct, (bucketProduct) => bucketProduct['product'])
  @JoinTable()
  bucketProduct: BucketProduct;

  @OneToMany(() => CheckoutProduct, (checkoutProduct) => checkoutProduct['product'])
  @JoinTable()
  checkoutProduct: CheckoutProduct;
}

export default Product;
