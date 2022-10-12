
import { Entity, Column, PrimaryColumn } from '@plugin/type-orm';


@Entity('CheckoutStatus')
class CheckoutStatus {
  @PrimaryColumn('varchar')
  code: string;

  @Column('varchar', { nullable: true, unique: true })
  displayName: string;

  @Column('varchar', { nullable: true })
  description: string;
}

export default CheckoutStatus;
