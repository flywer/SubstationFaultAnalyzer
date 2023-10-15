import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm"
import {Interval} from "@main/entity/Interval";


/**
 * 变电站
 */
@Entity()
export class Substation {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    substationName: string

    @OneToMany(() => Interval, interval => interval.substation)
    interval: Interval[]
}
