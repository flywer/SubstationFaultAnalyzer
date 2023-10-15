import {Result} from "@main/vo/resultVo";
import {ipcInstance} from "@render/plugins";
import {channels} from "@render/api/channels";
import {SwitchPos} from "@main/entity/SwitchPos";

export const find_all_switchPos = async (): Promise<Result<SwitchPos[]>> => {
    const {data} = await ipcInstance.send(channels.switchPos.findAll)
    return data
}
