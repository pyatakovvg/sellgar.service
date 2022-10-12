
import {
  Entity,
  Column,
  JoinTable,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from '@plugin/type-orm';

import Product from "./Product";
import CheckoutStatus from "./CheckoutStatus";


@Entity('Checkout')
class Checkout {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('varchar', { nullable: true, unique: true })
  externalId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


  @ManyToOne(() => CheckoutStatus, (status) => status['code'])
  @JoinColumn()
  status: CheckoutStatus;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];
}

export default Checkout;
