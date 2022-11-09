
import {
  Index,
  Entity,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from '@plugin/type-orm';

import Image from './Image';
import Store from './Store';


@Entity('Catalog')
class Catalog {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Index()
  @Column('varchar', { nullable: true, unique: true, default: null })
  externalId: string;

  @Column('varchar', { nullable: true, default: null })
  groupCode: string;

  @Column('varchar', { nullable: true, default: null })
  categoryCode: string;

  @Column('varchar', { nullable: false, default: '' })
  name: string;

  @Column('boolean', { default: false })
  isUse: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


  @ManyToOne(() => Image, (image) => image['uuid'], {
    onDelete: 'SET NULL',
    orphanedRowAction: 'nullify',
  })
  @JoinColumn()
  image: Image;

  @OneToOne(() => Store, (product) => product['uuid'], {
    onDelete: 'SET NULL',
    orphanedRowAction: 'nullify',
  })
  @JoinColumn()
  product: Store;
}

export default Catalog;
