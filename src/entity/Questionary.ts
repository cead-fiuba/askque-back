import { Entity, Column, OneToMany, ManyToOne, PrimaryColumn, JoinTable } from "typeorm";
import { Question } from "./Question";
import { Response } from "./Response"
import { Teacher } from "./Teacher";


@Entity()
export class Questionary {

    @PrimaryColumn()
    hash: string

    @Column()
    name: string;

    @Column("text", { nullable: true })
    description: string

    @Column()
    time_in_minutes: number;

    @OneToMany(type => Question, q => q.questionary, { eager: true, cascade: ["insert", "update"] })
    questions: Question[]

    @OneToMany(type => Response, response => response.questionary)
    responses: Response[]

    @ManyToOne(type => Teacher, u => u.createdQuestionaries)
    teacher: Teacher

    @Column()
    date: Date

    @Column()
    module: string

    @Column('int2', { nullable: true, default: 0 })
    quantity_respones: number

    @Column({ nullable: true })
    teacher_name: string

    @Column({ nullable: true })
    user_name: string

    @Column('int2', { nullable: true })
    semester: number

    @Column({ default: false })
    can_show_result: boolean
}