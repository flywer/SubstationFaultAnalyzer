import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Interval} from "@main/entity/Interval";

/**
 * 保护动作信息
 */
@Entity()
export class ProAct {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    proActName: string

    @ManyToOne(() => Interval, interval => interval.id)
    interval: Interval;
}
