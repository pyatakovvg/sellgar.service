
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
} from '@plugin/type-orm';

import Bucket from "./Bucket";
import Product from "./Product";


@Entity('BucketProduct')
class BucketProduct {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('integer', { nullable: false, default: 0 })
  count: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


  @ManyToOne(() => Bucket, (bucket) => bucket['uuid'], {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  bucket: Bucket;

  @ManyToOne(() => Product, (product) => product['uuid'])
  @JoinColumn()
  product: Product;
}

export default BucketProduct;
