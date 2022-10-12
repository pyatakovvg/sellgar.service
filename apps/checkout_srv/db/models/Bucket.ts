
import {
  Entity,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from '@plugin/type-orm';

import BucketProduct from './BucketProduct';


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
}

export default Bucket;
