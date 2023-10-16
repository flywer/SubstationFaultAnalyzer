import {Controller, IpcHandle} from "einf";
import {channels} from "@render/api/channels";
import {AppDataSource} from "@main/dataSource/app-data-source";
import {failure, Result, success} from "@main/vo/resultVo";
import log from "electron-log";
import {ProAct} from "@main/entity/ProAct";
import {Like} from "typeorm";

@Controller()
export class ProActController {
    constructor() {
    }

    @IpcHandle(channels.proAct.findAll)
    public async handleFindAll() {
        return new Promise<Result<ProAct[]>>((resolve) => {
            AppDataSource.getRepository(ProAct).find({relations: ["interval"]}).then(res => {
                const result = success()
                result.data = res
                resolve(result)
            }).catch(error => {
                log.error(error)
                resolve(failure(`保护动作信息获取失败:${error}`))
            })
        });
    }

    @IpcHandle(channels.proAct.findProActByName)
    public async handleFindProActByName(name: string) {
        return new Promise<Result<ProAct[]>>((resolve) => {
            AppDataSource.getRepository(ProAct).find({
                where: {
                    proActName: Like(`%${name || ''}%`)
                }, relations: ["interval"]
            }).then(res => {
                const result = success()
                result.data = res
                resolve(result)
            }).catch(error => {
                log.error(error)
                resolve(failure(`保护动作信息获取失败:${error}`))
            })
        });
    }


}
