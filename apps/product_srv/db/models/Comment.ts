
import { Entity, PrimaryColumn } from '@plugin/type-orm';


@Entity('Comment')
class Comment {
  @PrimaryColumn('uuid')
  uuid: string;
}

export default Comment;
