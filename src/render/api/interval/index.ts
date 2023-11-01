import {Result} from "@main/vo/resultVo";
import {ipcInstance} from "@render/plugins";
import {channels} from "@render/api/channels";
import {Interval} from "@main/entity/Interval";

export const find_by_interval_id = async (intervalId: number): Promise<Result<Interval>> => {
    const {data} = await ipcInstance.send(channels.interval.findByIntervalId, intervalId)
    return data
}

export const find_all_interval = async (): Promise<Result<Interval[]>> => {
    const {data} = await ipcInstance.send(channels.interval.findAllInterval)
    return data
}

export const find_by_interval_name = async (name: string) => {
    const {data} = await ipcInstance.send(channels.interval.findByIntervalName)
    return data
}

export const delete_interval_by_id = async (id: number): Promise<Result<any>> => {
    const {data} = await ipcInstance.send(channels.interval.deleteIntervalById, id)
    return data
}

export const update_interval_name_by_id = async (id: number, name: string): Promise<Result<any>> => {
    const {data} = await ipcInstance.send(channels.interval.updateNameById, id, name)
    return data
}
