
import {
  Index,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinTable,
  JoinColumn, Column,
} from '@plugin/type-orm';

import Store from './Store';
import Catalog from './Catalog';


@Entity('CatalogProduct')
class CatalogProduct {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('varchar', { nullable: true })
  label: string;

  @ManyToOne(() => Store, (store) => store['uuid'], {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinTable()
  product: Store;

  @ManyToOne(() => Catalog, (catalog) => catalog['uuid'], {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  catalog: Catalog;
}

export default CatalogProduct;
