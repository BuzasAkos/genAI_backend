import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity()
export class Barchoba {
  @ObjectIdColumn()
  id: string;

  @Column()
  solution: string;

  @Column()
  active: boolean;

  @Column('json')
  messages: Array<{ role: string; content: string }>;
}