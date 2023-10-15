import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Interval} from "@main/entity/Interval";

/**
 * 开关变位信息
 */
@Entity()
export class SwitchPos {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    switchPosName: string

    @ManyToOne(() => Interval, interval => interval.id)
    interval: Interval;
}
