import {Result} from "@main/vo/resultVo";
import {ipcInstance} from "@render/plugins";
import {channels} from "@render/api/channels";
import {ProAct} from "@main/entity/ProAct";

export const find_all_proAct = async (): Promise<Result<ProAct[]>> => {
    const {data} = await ipcInstance.send(channels.proAct.findAll)
    return data
}

export const find_proAct_by_name = async (name: string): Promise<Result<ProAct[]>> => {
    const {data} = await ipcInstance.send(channels.proAct.findProActByName,name)
    return data
}
