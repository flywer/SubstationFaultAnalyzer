import {Result} from "@main/vo/resultVo";
import {ipcInstance} from "@render/plugins";
import {channels} from "@render/api/channels";
import {PageResult, PageVo} from "@common/types/page.types";


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
