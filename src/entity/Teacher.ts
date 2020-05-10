import { Entity, PrimaryGeneratedColumn, Column, OneToMany, PrimaryColumn } from "typeorm";
import { Questionary } from "./Questionary";
import { TeacherOcupation } from "./UserOcupation";

@Entity()
export class Teacher {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string;

    @PrimaryColumn()
    email: string;

    @OneToMany(type => Questionary, q => q.teacher)
    createdQuestionaries: Questionary[]

    @Column("enum", { enum: TeacherOcupation })
    ocupation: TeacherOcupation
}
