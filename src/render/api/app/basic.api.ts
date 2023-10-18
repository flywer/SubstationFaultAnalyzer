import {Result} from "@main/vo/resultVo";
import {channels} from "@render/api/channels";
import {ipcInstance} from "@render/plugins";
import {AppSetup} from "@common/types/app.types";

export const get_app_version = async (): Promise<Result<string>> => {
    const {data} = await ipcInstance.send(channels.app.getAppVersion)
    return data
}

export const clipboard_write_text = (text: string) => {
    return ipcInstance.send(channels.app.clipboard.writeText, text)
}

export const get_app_settings = async (): Promise<Result<any>> => {
    const {data} = await ipcInstance.send(channels.app.getSettings)
    return data
}

/**
 * 写入应用设置
 * @param setupModel
 */
export const set_app_settings = async (setupModel: AppSetup): Promise<Result<any>> => {
    const {data} = await ipcInstance.send(channels.app.updateSettings, setupModel)
    return data
}

export const open_default_browser = (link: string) => {
    return ipcInstance.send(channels.app.openDefaultBrowser, link)
}
