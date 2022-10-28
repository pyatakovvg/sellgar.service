
import { Index, Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from '@plugin/type-orm';

import Image from './Image';
import CatalogProduct from './CatalogProduct';


@Entity('Catalog')
class Catalog {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Index()
  @Column('varchar', { nullable: true, unique: true })
  externalId: string;

  @Column('varchar', { nullable: true, default: null })
  groupCode: string;

  @Column('varchar', { nullable: true, default: null })
  categoryCode: string;

  @Column('varchar', { nullable: false, default: '' })
  name: string;

  @Column('varchar', { nullable: true })
  description: string;

  @Column('boolean', { default: false })
  isUse: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


  @ManyToOne(() => Image, (image) => image['uuid'], {
    onDelete: 'CASCADE',
    orphanedRowAction: 'nullify',
  })
  @JoinColumn()
  image: Image;

  @OneToMany(() => CatalogProduct, (product) => product['catalog'], {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  products: CatalogProduct[];
}

export default Catalog;
