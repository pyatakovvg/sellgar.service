
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from '@plugin/type-orm';


@Entity('Customer')
class Customer {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('varchar', { nullable: false, default: '' })
  name: string;

  @Column('varchar', { nullable: false, default: '' })
  email: string;

  @Column('varchar', { nullable: false, default: '' })
  phone: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default Customer;
