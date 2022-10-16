
import { Entity, Column, PrimaryColumn, OneToMany, JoinTable } from '@plugin/type-orm';

import PaymentDetail from "./PaymentDetail";


@Entity('Payment')
class Payment {
  @PrimaryColumn('varchar')
  code: string;

  @Column('varchar', { nullable: false })
  name: string;

  @Column('varchar', { nullable: true })
  description: string;

  @Column('boolean', { default: true })
  isUse: boolean;

  @Column('integer', { default: 0 })
  order: number;


  @OneToMany(() => PaymentDetail, (details) => details['payment'])
  @JoinTable()
  details: PaymentDetail[];
}

export default Payment;
