
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from '@plugin/type-orm';


@Entity('Image')
class Image {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('varchar', { nullable: true })
  name: string;

  @Column('integer', { nullable: false, default: 0 })
  size: number;

  @Column('varchar', { nullable: true })
  mime: string;

  @Column('integer', { default: 0 })
  width: number;

  @Column('integer', { default: 0 })
  height: number;

  @Column('bytea', { nullable: true })
  buffer: Buffer;

  @CreateDateColumn()
  createdAt: Date;
}

export default Image;