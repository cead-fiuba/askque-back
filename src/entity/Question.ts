import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinTable, JoinColumn } from "typeorm";
import { Option } from "./Option";
import { Questionary } from "./Questionary";


@Entity()
export class Question {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    text: string;

    @Column("boolean", { nullable: true, default: false })
    has_image: boolean;

    @Column('text', { nullable: true })
    image_url: string;

    @OneToMany(type => Option, option => option.question, { eager: true, cascade: true })
    options: Option[]

    @ManyToOne(type => Questionary, questionary => questionary.questions, { onDelete: 'CASCADE' })
    questionary: Questionary;
}