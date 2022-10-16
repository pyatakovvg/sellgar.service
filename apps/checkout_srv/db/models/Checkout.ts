
import {
  Entity,
  Column,
  JoinTable,
  ManyToOne,
  OneToMany,
  Generated,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from '@plugin/type-orm';

import Payment from "./Payment";
import Currency from "./Currency";
import Delivery from "./Delivery";
import CheckoutDetail from "./CheckoutDetail";
import CheckoutStatus from "./CheckoutStatus";
import DeliveryDetail from "./DeliveryDetail";
import CheckoutProduct from "./CheckoutProduct";


@Entity('Checkout')
class Checkout {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('integer', { unique: true })
  @Generated('increment')
  externalId: string;

  @Column('numeric', { precision: 10, scale: 2, default: 0 })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


  @ManyToOne(() => CheckoutStatus, (status) => status['code'])
  @JoinColumn()
  status: CheckoutStatus;

  @OneToMany(() => CheckoutProduct, (product) => product['checkout'], {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  products: CheckoutProduct[];

  @ManyToOne(() => Currency, (currency) => currency['code'])
  @JoinColumn()
  currency: Currency;

  @ManyToOne(() => Delivery, (delivery) => delivery['code'])
  @JoinColumn()
  delivery: Delivery;

  @ManyToOne(() => Payment, (payment) => payment['code'])
  @JoinColumn()
  payment: Payment;

  @OneToMany(() => CheckoutDetail, (details) => details['checkout'], {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  details: DeliveryDetail[];
}

export default Checkout;
