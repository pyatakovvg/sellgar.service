
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from '@plugin/type-orm';

import Payment from './Payment';
import Checkout from "./Checkout";


@Entity('PaymentDetail')
class PaymentDetail {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('varchar', { nullable: false })
  name: string;

  @Column('varchar', { nullable: true })
  value: string;


  @ManyToOne(() => Payment, (payment) => payment['code'])
  @JoinColumn()
  payment: Payment;

  @ManyToOne(() => Checkout, (checkout) => checkout['code'], {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  checkout: Checkout;
}

export default PaymentDetail;
