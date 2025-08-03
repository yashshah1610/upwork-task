import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity()
  export class Resource {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ length: 255 })
    name!: string;
  
    @Column({ length: 20 })
    type!: string;

    @Column()
    url!: string;
  
    @CreateDateColumn()
    createdAt!: Date;
  
    @UpdateDateColumn()
    updatedAt!: Date;
  }
  