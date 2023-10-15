import {Controller, IpcHandle} from "einf";
import {channels} from "@render/api/channels";
import {AppDataSource} from "@main/dataSource/app-data-source";
import {failure, Result, success} from "@main/vo/resultVo";
import log from "electron-log";
import {SwitchPos} from "@main/entity/SwitchPos";

@Controller()
export class SwitchPosController {
    constructor() {
    }

    @IpcHandle(channels.switchPos.findAll)
    public async handleFindAll() {
        return new Promise<Result<SwitchPos[]>>((resolve) => {
            AppDataSource.getRepository(SwitchPos).find({relations: ["interval"]}).then(res => {
                const result = success()
                result.data = res
                resolve(result)
            }).catch(error => {
                log.error(error)
                resolve(failure(`开关变为数据获取失败:${error}`))
            })
        });
    }


}
