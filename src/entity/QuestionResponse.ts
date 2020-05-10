import { Response } from "./Response";
import { ManyToOne, PrimaryGeneratedColumn, Entity, Column } from "typeorm";


/**
 * 
 * Las options que se encuentran aca son las que fueron marcadas por el alumno para la pregunta dada
 * 
 */

@Entity()
export class QuestionResponse {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    questionId: number

    @Column("simple-array")
    optionIds: number[]

    @ManyToOne(type => Response, response => response.question_responses)
    response: Response

}