import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Question } from "./Question";


@Entity()
export class Option {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    text: string;

    @Column()
    correct: boolean;

    @ManyToOne(type => Question, question => question.options, { onDelete: 'CASCADE' })
    question: Question;
}