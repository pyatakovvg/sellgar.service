
import { Entity, Column, PrimaryGeneratedColumn, JoinTable, OneToMany } from '@plugin/type-orm';

import Comment from "./Comment";


@Entity('Product')
class Product {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('varchar', { nullable: true, unique: true })
  externalId: string;

  @Column('varchar', { nullable: true })
  name: string;

  @OneToMany(() => Comment, (comment) => comment['product'], {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  comments: Comment[];
}

export default Product;
