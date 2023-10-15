import {Result} from "@main/vo/resultVo";
import {ipcInstance} from "@render/plugins";
import {channels} from "@render/api/channels";
import {Interval} from "@main/entity/Interval";

export const find_by_interval_id = async (intervalId: number): Promise<Result<Interval>> => {
    const {data} = await ipcInstance.send(channels.interval.findByIntervalId, intervalId)
    return data
}
