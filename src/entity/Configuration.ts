import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Configuration {

    @PrimaryColumn()
    name: string

    @Column()
    value: string;
}
