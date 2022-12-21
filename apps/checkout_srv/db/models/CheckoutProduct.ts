
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from '@plugin/type-orm';

import Store from "./Store";
import Checkout from "./Checkout";
import Currency from "./Currency";


@Entity('CheckoutProduct')
class CheckoutProduct {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('numeric', { precision: 10, scale: 2, default: 0 })
  price: number;

  @Column('integer', { nullable: false, default: 0 })
  count: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


  @ManyToOne(() => Currency, (currency) => currency['code'])
  @JoinColumn()
  currency: Currency;

  @ManyToOne(() => Checkout, (checkout) => checkout['uuid'], {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  checkout: Checkout;

  @ManyToOne(() => Store, (store) => store['uuid'])
  @JoinColumn()
  store: Store;
}

export default CheckoutProduct;
