import {Controller, IpcHandle} from "einf";
import {channels} from "@render/api/channels";
import {AppDataSource} from "@main/dataSource/app-data-source";
import {failure, Result, success} from "@main/vo/resultVo";
import log from "electron-log";
import {Interval} from "@main/entity/Interval";

@Controller()
export class IntervalController {
    constructor() {
    }

    @IpcHandle(channels.interval.findByIntervalId)
    public async handleFindByIntervalId(intervalId: number) {
        return new Promise<Result<Interval>>((resolve) => {
            AppDataSource.getRepository(Interval).findOne({
                    where: {
                        id: intervalId
                    },
                    relations: ["substation", "proAct", "switchPos"]
                }
            ).then(res => {
                const result = success()
                result.data = res
                resolve(result)
            }).catch(error => {
                log.error(error)
                resolve(failure(`间隔数据获取失败:${error}`))
            })
        });
    }

    @IpcHandle(channels.interval.findAllInterval)
    public async handleFindAllInterval() {
        return new Promise<Result<Interval[]>>((resolve) => {
            AppDataSource.getRepository(Interval).find({relations: ["substation", "proAct", "switchPos"]}).then(res => {
                const result = success()
                result.data = res
                resolve(result)
            }).catch(error => {
                log.error(error)
                resolve(failure(`间隔数据获取失败:${error}`))
            })
        });
    }

        @IpcHandle(channels.interval.findByIntervalName)
    public async handleFindByIntervalName(name:string) {
        return new Promise<Result<Interval[]>>((resolve) => {
            AppDataSource.getRepository(Interval).find({where:{
                intervalName:name
                },relations: ["substation", "proAct", "switchPos"]}).then(res => {
                const result = success()
                result.data = res
                resolve(result)
            }).catch(error => {
                log.error(error)
                resolve(failure(`间隔数据获取失败:${error}`))
            })
        });
    }

}
