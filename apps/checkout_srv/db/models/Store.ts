
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index, JoinTable,
} from '@plugin/type-orm';

import Currency from "./Currency";
import CatalogProduct from "./CatalogProduct";


@Entity('Store')
class Store {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('varchar', { nullable: true, default: null })
  brandCode: string;

  @Column('varchar', { nullable: true })
  name: string;

  @Column('varchar', { nullable: true, unique: true })
  barcode: string;

  @Column('varchar', { nullable: true, unique: true })
  vendor: string;

  @Column('numeric', { precision: 10, scale: 2, default: 0 })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


  @ManyToOne(() => Currency, (currency) => currency['code'])
  @JoinColumn()
  currency: Currency;

  @OneToMany(() => CatalogProduct, (product) => product['product'], {
    onDelete: 'SET NULL',
    orphanedRowAction: 'nullify',
  })
  @JoinTable()
  product: CatalogProduct[];
}

export default Store;
