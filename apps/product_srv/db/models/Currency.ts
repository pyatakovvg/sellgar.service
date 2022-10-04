
import { Entity, Column, PrimaryColumn } from '@plugin/type-orm';


@Entity('Currency')
class Currency {
  @PrimaryColumn({ unique: true })
  code: string;

  @Column('varchar', { nullable: false, length: 16 })
  displayName: string;
}

export default Currency;
