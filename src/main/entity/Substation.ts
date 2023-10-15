import {Entity, PrimaryGeneratedColumn, Column} from "typeorm"


/**
 * 变电站
 */
@Entity()
export class Substation {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    substationName: string
}
