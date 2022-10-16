
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from '@plugin/type-orm';

import Checkout from './Checkout';


@Entity('CheckoutDetail')
class CheckoutDetail {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('varchar', { nullable: false })
  name: string;

  @Column('varchar', { nullable: true })
  value: string;


  @ManyToOne(() => Checkout, (checkout) => checkout['code'], {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  checkout: Checkout;
}

export default CheckoutDetail;
