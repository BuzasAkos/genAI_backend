import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity()
export class Barchoba {
  @ObjectIdColumn()
  id: string;

  @Column()
  started: Date;
  
  @Column()
  solution: string;

  @Column()
  active: boolean;

  @Column()
  successful: boolean;

  @Column('json')
  messages: Array<{ role: string; content: string }>;
}