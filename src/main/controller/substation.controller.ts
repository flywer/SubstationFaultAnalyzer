import {Controller, IpcHandle} from "einf";
import {channels} from "@render/api/channels";
import {AppDataSource} from "@main/dataSource/app-data-source";
import {Substation} from "@main/entity/Substation";
import {failure, Result, success} from "@main/vo/resultVo";
import log from "electron-log";
import {Interval} from "@main/entity/Interval";
import {Like, In} from "typeorm";
import {ProAct} from "@main/entity/ProAct";
import {SwitchPos} from "@main/entity/SwitchPos";

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

    @IpcHandle(channels.substation.findBySubstationName)
    public async handleFindBySubstationName(name: string) {
        return new Promise<Result<Substation>>((resolve) => {
            AppDataSource.getRepository(Substation).findOne({
                relations: ['interval'], where: {
                    substationName: Like(`%${name || ''}%`)
                }
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

    @IpcHandle(channels.substation.findSubstationByName)
    public async handleFindSubstationByName(name: string) {
        return new Promise<Result<Substation>>((resolve) => {
            AppDataSource.getRepository(Substation).findOne({
                where: {
                    substationName: name || ''
                }
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

    @IpcHandle(channels.substation.updateNameById)
    public async handleUpdateNameById(id: number, name: string) {
        return new Promise<Result<Substation>>(async (resolve) => {
            const substation = await AppDataSource.getRepository(Substation).findOne({
                where: {id: id}
            })
            substation.substationName = name

            AppDataSource.getRepository(Substation).save(substation).then(res => {
                const result = success('变电站数据更新成功')
                result.data = res
                resolve(result)
            }).catch(error => {
                log.error(error)
                resolve(failure(`变电站数据更新失败:${error}`))
            })
        });
    }

    @IpcHandle(channels.substation.deleteSubstationById)
    public async handleDeleteIntervalById(id: number) {
        return new Promise<Result<any>>(async (resolve) => {

            // 查询所有间隔
            const intervals = await AppDataSource.getRepository(Interval).find({
                where: {
                    substation: {
                        id: id
                    }
                }
            })

            const intervalIds = intervals.map(interval => interval.id)

            // 删除保护动作信息
            const proActs = await AppDataSource.getRepository(ProAct).find({
                where: {
                    interval: {
                        id: In(intervalIds)
                    }
                }
            })
            await AppDataSource.getRepository(ProAct).remove(proActs)


            // 删除开关变位信息
            const switchPos = await AppDataSource.getRepository(SwitchPos).find({
                where: {
                    interval: {
                        id: In(intervalIds)
                    }
                }
            })

            await AppDataSource.getRepository(SwitchPos).remove(switchPos)

            // 删除间隔
            await AppDataSource.getRepository(Interval).remove(intervals)

            AppDataSource.getRepository(Substation).delete(id).then(res => {
                const result = success('删除成功')
                result.data = res
                resolve(result)
            }).catch(error => {
                log.error(error)
                resolve(failure(`变电站数据删除失败:${error}`))
            })
        })
    }
}
