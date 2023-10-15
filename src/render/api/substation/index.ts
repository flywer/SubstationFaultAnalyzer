import {Result} from "@main/vo/resultVo";
import {ipcInstance} from "@render/plugins";
import {channels} from "@render/api/channels";
import {Substation} from "@main/entity/Substation";

export const find_all_substation = async (): Promise<Result<Substation[]>> => {
    const {data} = await ipcInstance.send(channels.substation.findAll)
    return data
}

export const find_substation_by_id = async (id: string | number): Promise<Result<Substation>> => {
    const {data} = await ipcInstance.send(channels.substation.findSubstationById, typeof id === "string" ? parseInt(id) : id)
    return data
}

export const find_substation_by_interval_id = async (intervalId: number): Promise<Result<Substation>> => {
    const {data} = await ipcInstance.send(channels.substation.findByIntervalId, intervalId)
    return data
}
