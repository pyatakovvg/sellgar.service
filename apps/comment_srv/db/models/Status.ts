
import {
  Entity,
  Column,
  PrimaryColumn,
} from '@plugin/type-orm';


@Entity('Status')
class Comment {
  @PrimaryColumn('varchar')
  code: string;

  @Column('varchar')
  name: string;
}

export default Comment;
