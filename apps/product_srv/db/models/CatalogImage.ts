
import {
  Index,
  Entity,
  Column,
  ManyToOne,
  JoinTable,
  JoinColumn,
  PrimaryGeneratedColumn,
} from '@plugin/type-orm';

import Image from './Image';
import Catalog from './Catalog';


@Entity('CatalogImage')
class CatalogImage {
  @Index()
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

  @ManyToOne(() => Catalog, (product) => product['uuid'], {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  catalog: Catalog;
}

export default CatalogImage;
