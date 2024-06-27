import { Entity, ObjectIdColumn, Column } from 'typeorm';

@Entity('vectors')
export class Vector {
  @ObjectIdColumn()
  id: string;

  @Column()
  topicID: string;

  @Column()
  text: string;

  @Column('array')
  embedding: number[];
}