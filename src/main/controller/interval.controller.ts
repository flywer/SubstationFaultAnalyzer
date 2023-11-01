import {Controller, IpcHandle} from "einf";
import {channels} from "@render/api/channels";
import {AppDataSource} from "@main/dataSource/app-data-source";
import {failure, Result, success} from "@main/vo/resultVo";
import log from "electron-log";
import {Interval} from "@main/entity/Interval";
import {ProAct} from "@main/entity/ProAct";
import {SwitchPos} from "@main/entity/SwitchPos";
import {Substation} from "@main/entity/Substation";

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
    public async handleFindByIntervalName(name: string) {
        return new Promise<Result<Interval[]>>((resolve) => {
            AppDataSource.getRepository(Interval).find({
                where: {
                    intervalName: name
                }, relations: ["substation", "proAct", "switchPos"]
            }).then(res => {
                const result = success()
                result.data = res
                resolve(result)
            }).catch(error => {
                log.error(error)
                resolve(failure(`间隔数据获取失败:${error}`))
            })
        });
    }

    @IpcHandle(channels.interval.updateNameById)
    public async handleUpdateNameById(id: number, name: string) {
        return new Promise<Result<Interval>>(async (resolve) => {
            const interval = await AppDataSource.getRepository(Interval).findOne({
                where: {id: id}
            })
            interval.intervalName = name

            AppDataSource.getRepository(Interval).save(interval).then(res => {
                const result = success('间隔数据更新成功')
                result.data = res
                resolve(result)
            }).catch(error => {
                log.error(error)
                resolve(failure(`间隔数据更新失败:${error}`))
            })
        });
    }

    @IpcHandle(channels.interval.deleteIntervalById)
    public async handleDeleteIntervalById(id: number) {
        return new Promise<Result<any>>(async (resolve) => {

            // 删除保护动作信息
            const proActs = await AppDataSource.getRepository(ProAct).find({
                where: {
                    interval: {
                        id: id
                    }
                }
            })
            await AppDataSource.getRepository(ProAct).remove(proActs)

            // 删除开关变位信息
            const switchPos = await AppDataSource.getRepository(SwitchPos).find({
                where: {
                    interval: {
                        id: id
                    }
                }
            })

            await AppDataSource.getRepository(SwitchPos).remove(switchPos)

            AppDataSource.getRepository(Interval).delete(id).then(res => {
                const result = success('删除成功')
                result.data = res
                resolve(result)
            }).catch(error => {
                log.error(error)
                resolve(failure(`间隔数据删除失败:${error}`))
            })
        })


    }

}
