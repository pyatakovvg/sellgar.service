
import {
  Tree,
  TreeParent,
  TreeChildren,
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from '@plugin/type-orm';

import Status from "./Status";
import Product from "./Product";


@Entity('Comment')
@Tree('closure-table')
class Comment {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('varchar')
  message: string;

  @TreeParent()
  parent: Comment;

  @TreeChildren()
  children: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


  @ManyToOne(() => Status, (status) => status['code'])
  @JoinColumn()
  status: Status;

  @ManyToOne(() => Product, (product) => product['comments'], {})
  product: Product;
}

export default Comment;
