
import { Tree, Entity, Column, TreeParent, TreeChildren, PrimaryGeneratedColumn, CreateDateColumn } from '@plugin/type-orm';

@Entity('Folder')
@Tree('closure-table')
class Folder {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('varchar', { nullable: true })
  name: string;

  @TreeChildren({
    cascade: true,
  })
  children: Folder[]

  @TreeParent({
    onDelete: 'CASCADE',
  })
  parent: Folder

  @CreateDateColumn()
  createdAt: Date;
}

export default Folder;