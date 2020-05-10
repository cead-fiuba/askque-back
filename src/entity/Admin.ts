import { Entity, PrimaryGeneratedColumn, Column, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export class Admin {

    @PrimaryGeneratedColumn()
    id: number

    @PrimaryColumn()
    email: string;

    readPermission: boolean

    writePermission: boolean
}
