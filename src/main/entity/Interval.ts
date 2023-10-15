import {Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany} from "typeorm";
import {Substation} from "@main/entity/Substation";
import {ProAct} from "@main/entity/ProAct";
import {SwitchPos} from "@main/entity/SwitchPos";

/**
 * 变电站间隔
 */
@Entity()
export class Interval {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    intervalName: string

    @ManyToOne(() => Substation, substation => substation.id)
    substation: Substation;

    @OneToMany(() => ProAct, proAct => proAct.interval)
    proAct: ProAct[]

    @OneToMany(() => SwitchPos, switchPos => switchPos.interval)
    switchPos: SwitchPos[]
}
