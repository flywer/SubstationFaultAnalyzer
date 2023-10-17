import {Result} from "@main/vo/resultVo";
import {ipcInstance} from "@render/plugins";
import {channels} from "@render/api/channels";
import {PageResult, PageVo} from "@common/types/page.types";
import {FaultSaveModel} from "@common/types/faultData.types";


export const import_by_excel = async (): Promise<Result<any>> => {
    const {data} = await ipcInstance.send(channels.faultData.importByExcel)
    return data
}

export const download_template = async (): Promise<Result<any>> => {
    const {data} = await ipcInstance.send(channels.faultData.downloadTemplate)
    return data
}


export const find_fault_data_by_page = async (pageParams: PageVo): Promise<Result<PageResult<any>>> => {
    const {data} = await ipcInstance.send(channels.faultData.findFaultDataByPage, pageParams)
    return data
}

export const save_fault_data = async (model: FaultSaveModel): Promise<Result<any>> => {
    const {data} = await ipcInstance.send(channels.faultData.saveFaultData, model)
    return data
}

export const delete_fault_data = async (faultType: number, faultId: number): Promise<Result<any>> => {
    const {data} = await ipcInstance.send(channels.faultData.deleteFaultData, faultType, faultId)
    return data
}
