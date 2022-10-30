
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

import Brand from './Brand';
import Catalog from "./Catalog";
import Currency from "./Currency";


@Entity('Store')
class Store {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('varchar', { nullable: true })
  name: string;

  @Column('varchar', { nullable: true, unique: true })
  barcode: string;

  @Column('varchar', { nullable: true, unique: true })
  vendor: string;

  @Column('varchar', { nullable: true })
  description: string;

  @Column('numeric', { precision: 10, scale: 2, default: 0 })
  price: number;

  @Column('numeric', { precision: 10, scale: 2, default: 0 })
  purchasePrice: number;

  @Column('integer', { nullable: false, default: 0 })
  count: number;

  @Column('integer', { nullable: false, default: 0 })
  reserve: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


  @ManyToOne(() => Currency, (currency) => currency['code'])
  @JoinColumn()
  currency: Currency;

  @ManyToOne(() => Brand, (brand) => brand['uuid'], {
    onDelete: 'SET NULL',
    orphanedRowAction: 'nullify',
  })
  @JoinColumn()
  brand: Brand;

  @OneToOne(() => Catalog, (product) => product['product'], {
    onDelete: 'SET NULL',
    orphanedRowAction: 'nullify',
  })
  catalog: Catalog;
}

export default Store;
