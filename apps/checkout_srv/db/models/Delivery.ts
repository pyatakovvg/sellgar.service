
import { Entity, Column, PrimaryColumn, OneToMany, JoinTable } from '@plugin/type-orm';

import DeliveryDetail from "./DeliveryDetail";


@Entity('Delivery')
class Delivery {
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


  @OneToMany(() => DeliveryDetail, (details) => details['delivery'])
  @JoinTable()
  details: DeliveryDetail[];
}

export default Delivery;
