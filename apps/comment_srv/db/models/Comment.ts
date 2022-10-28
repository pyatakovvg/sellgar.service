
import {
  Tree,
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  TreeParent,
  TreeChildren,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
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

  @ManyToOne(() => Product, (product) => product['comments'], {
    onDelete: "CASCADE",
    orphanedRowAction: "delete",
  })
  product: Product;
}

export default Comment;
