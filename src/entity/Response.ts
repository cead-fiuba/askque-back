import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  PrimaryColumn,
  OneToMany,
  Index,
} from "typeorm";
import { Questionary } from "./Questionary";
import { QuestionResponse } from "./QuestionResponse";
import { Student } from "./Student";

@Entity()
@Index(["student", "questionary"], { unique: true })
@Index(["questionary"], { unique: false })
@Index(["student"], { unique: false })
export class Response {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Student, (student) => student.responses)
  student: Student;

  @ManyToOne((type) => Questionary, (questionary) => questionary.responses, {
    onDelete: "CASCADE",
  })
  questionary: Questionary;

  @OneToMany((type) => QuestionResponse, (q) => q.response, {
    cascade: ["insert"],
    onDelete: "CASCADE",
  })
  question_responses: QuestionResponse[];

  @Column({ nullable: true })
  date: Date;
}
