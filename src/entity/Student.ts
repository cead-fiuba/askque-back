import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { Response } from "./Response";

@Entity()
export class Student {

    @Column()
    padron: number;

    @Column()
    name: string;

    @PrimaryColumn()
    email: string;

    @Column()
    password: string;

    @OneToMany(type => Response, r => r.student)
    responses: Response[]

}
