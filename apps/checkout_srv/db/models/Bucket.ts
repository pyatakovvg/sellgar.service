
import {
  Entity,
  JoinTable,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from '@plugin/type-orm';

import Customer from './Customer';
import BucketProduct from './BucketProduct';
import Currency from "./Currency";


@Entity('Bucket')
class Bucket {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


  @OneToMany(() => BucketProduct, (bucketProduct) => bucketProduct['bucket'], {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  products: BucketProduct[];

  @ManyToOne(() => Customer, (customer) => customer['uuid'], {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinTable()
  customer: Customer;

  @ManyToOne(() => Currency, (currency) => currency['code'])
  @JoinColumn()
  currency: Currency;
}

export default Bucket;
