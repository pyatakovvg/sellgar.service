
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinTable,
  JoinColumn,
} from '@plugin/type-orm';

import Image from './Image';
import Product from './Product';


@Entity('ProductImage')
class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('integer', { default: 0 })
  order: number;


  @ManyToOne(() => Image, (image) => image['uuid'], {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinTable()
  image: Image;

  @ManyToOne(() => Product, (product) => product['uuid'], {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  product: Product;
}

export default ProductImage;
