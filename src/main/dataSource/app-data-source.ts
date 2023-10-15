import {DataSource} from "typeorm"
import {APP_DATA_PATH} from "../../constants/app";
import {join} from "path";
import {Substation} from "@main/entity/Substation";
import {Interval} from "@main/entity/Interval";
import {ProAct} from "@main/entity/ProAct";
import {SwitchPos} from "@main/entity/SwitchPos";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: join(APP_DATA_PATH, '/local/SFA.sqlite'),
    entities: [Substation, Interval, ProAct, SwitchPos],
    synchronize: true,
    logging: false,
})
