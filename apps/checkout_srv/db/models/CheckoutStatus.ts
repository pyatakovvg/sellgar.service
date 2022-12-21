
import { Entity, Column, PrimaryColumn } from '@plugin/type-orm';


@Entity('CheckoutStatus')
class CheckoutStatus {
  @PrimaryColumn('varchar')
  code: string;

  @Column('varchar', { nullable: true, unique: true })
  displayName: string;

  @Column('varchar', { nullable: true })
  description: string;

  @Column('integer', { nullable: false, default: 0 })
  order: number;
}

export default CheckoutStatus;
