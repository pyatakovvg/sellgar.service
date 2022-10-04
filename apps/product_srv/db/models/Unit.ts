
import { Entity, Column, PrimaryGeneratedColumn } from '@plugin/type-orm';


@Entity('Unit')
class Unit {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('varchar', { unique: true })
  name: string;

  @Column('varchar')
  description: string;

  @Column('integer', { default: 999999 })
  order: number;
}

export default Unit;
