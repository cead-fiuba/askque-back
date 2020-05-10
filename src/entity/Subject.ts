import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Subject {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}