
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from '@plugin/type-orm';

import Image from "./Image";
import Currency from "./Currency";


@Entity('CheckoutProduct')
class CheckoutProduct {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('varchar', { nullable: true, unique: true })
  externalId: string;

  @Column('varchar', { nullable: true })
  title: string;

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
}

export default CheckoutProduct;
