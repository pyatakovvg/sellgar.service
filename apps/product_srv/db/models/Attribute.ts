
import { Index, Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, JoinTable, OneToMany } from '@plugin/type-orm';

import Unit from './Unit';
import AttributeValue from './AttributeValue';


@Entity('Attribute')
class Attribute {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('varchar')
  code: string;

  @Index({ fulltext: true })
  @Column('varchar')
  name: string;

  @Column('varchar', { nullable: true })
  description: string;

  @Column('boolean', { default: true })
  isFiltered: boolean;


  @ManyToOne(() => Unit, (unit) => unit['uuid'])
  @JoinColumn()
  unit: Unit;

  @OneToMany(() => AttributeValue, (value) => value['attribute'])
  @JoinTable()
  values: AttributeValue[];
}

export default Attribute;
