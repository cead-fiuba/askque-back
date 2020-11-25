import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { Questionary } from "./Questionary";
import { TeacherOcupation } from "./TeacherOcupation";

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column()
  legajo: number;

  @PrimaryColumn()
  email: string;

  @OneToMany((type) => Questionary, (q) => q.teacher)
  createdQuestionaries: Questionary[];

  @Column("enum", { enum: TeacherOcupation })
  ocupation: TeacherOcupation;
}
