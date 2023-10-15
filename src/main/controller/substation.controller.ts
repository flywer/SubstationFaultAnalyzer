import {Controller, IpcHandle} from "einf";
import {channels} from "@render/api/channels";
import {AppDataSource} from "@main/dataSource/app-data-source";
import {Substation} from "@main/entity/Substation";
import {failure, Result, success} from "@main/vo/resultVo";
import log from "electron-log";
import {Interval} from "@main/entity/Interval";

@Controller()
export class SubstationController {
    constructor() {
    }

    @IpcHandle(channels.substation.findAll)
    public async handleFindAll() {
        return new Promise<Result<Substation[]>>((resolve) => {
            AppDataSource.getRepository(Substation).find({relations: ['interval']}).then(res => {
                const result = success()
                result.data = res
                resolve(result)
            }).catch(error => {
                log.error(error)
                resolve(failure(`变电站数据获取失败:${error}`))
            })
        });
    }

    @IpcHandle(channels.substation.findSubstationById)
    public handleFindSubstationById(id: number) {
        return new Promise<Result<Substation>>((resolve) => {
            AppDataSource.getRepository(Substation).findOne({
                where: {
                    id: id
                },
                relations: ['interval']
            }).then(res => {
                const result = success()
                result.data = res
                resolve(result)
            }).catch(error => {
                log.error(error)
                resolve(failure(`变电站数据获取失败:${error}`))
            })
        });


    }

    @IpcHandle(channels.substation.findByIntervalId)
    public async handleFindByIntervalId(intervalId: number) {
        return new Promise<Result<Substation>>((resolve) => {
            AppDataSource.getRepository(Interval).findOne({
                where: {
                    id: intervalId
                },
                relations: ['substation']
            }).then(interval => {
                AppDataSource.getRepository(Substation).findOne({
                    where: {
                        id: interval.substation.id
                    }
                }).then(substation => {
                    const result = success()
                    result.data = substation
                    resolve(result)
                })
            }).catch(error => {
                log.error(error)
                resolve(failure(`数据获取失败:${error}`))
            })
        });
    }


}
