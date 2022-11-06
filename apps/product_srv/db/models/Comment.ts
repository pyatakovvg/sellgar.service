
import {Entity, PrimaryColumn, ManyToOne, JoinColumn} from '@plugin/type-orm';

import Catalog from "./Catalog";


@Entity('Comment')
class Comment {
  @PrimaryColumn('uuid')
  uuid: string;


  @ManyToOne(() => Catalog, (catalog) => catalog['uuid'], {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  catalog: Catalog;
}

export default Comment;
