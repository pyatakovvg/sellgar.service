
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from '@plugin/type-orm';

import Delivery from "./Delivery";
import Checkout from "./Checkout";


@Entity('DeliveryDetail')
class DeliveryDetail {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('varchar', { nullable: false })
  name: string;

  @Column('varchar', { nullable: true })
  value: string;


  @ManyToOne(() => Delivery, (delivery) => delivery['code'])
  @JoinColumn()
  delivery: Delivery;

  @ManyToOne(() => Checkout, (checkout) => checkout['code'], {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  checkout: Checkout;
}

export default DeliveryDetail;
