import {Result} from "@main/vo/resultVo";
import {ipcInstance} from "@render/plugins";
import {channels} from "@render/api/channels";
import {Substation} from "@main/entity/Substation";

export const find_all_substation = async (): Promise<Result<Substation[]>> => {
    const {data} = await ipcInstance.send(channels.substation.findAll)
    return data
}

export const find_by_substation_name = async (name: string): Promise<Result<Substation>> => {
    const {data} = await ipcInstance.send(channels.substation.findBySubstationName, name)
    return data
}

export const find_substation_by_name = async (name: string): Promise<Result<Substation>> => {
    const {data} = await ipcInstance.send(channels.substation.findSubstationByName, name)
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

export const delete_substation_by_id = async (id: number): Promise<Result<any>> => {
    const {data} = await ipcInstance.send(channels.substation.deleteSubstationById, id)
    return data
}

export const update_substation_name_by_id = async (id: number, name: string): Promise<Result<any>> => {
    const {data} = await ipcInstance.send(channels.substation.updateNameById, id, name)
    return data
}
