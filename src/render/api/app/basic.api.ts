import {Result} from "@main/vo/resultVo";
import {channels} from "@render/api/channels";
import {ipcInstance} from "@render/plugins";

export const get_app_version = async (): Promise<Result<string>> => {
    const {data} = await ipcInstance.send(channels.app.getAppVersion)
    return data
}
