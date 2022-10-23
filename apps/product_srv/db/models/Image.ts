
import { Index, Entity, Column, PrimaryColumn } from '@plugin/type-orm';


@Entity('Image')
class Image {
  @Index()
  @PrimaryColumn('uuid')
  uuid: string;

  @Column('varchar', { nullable: true })
  name: string;
}

export default Image;
