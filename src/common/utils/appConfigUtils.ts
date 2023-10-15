import {AppSetup} from "@common/types/app.types";
import {readFsAsync} from "@common/utils/fsUtils";
import {APP_CONFIG_PATH} from "../../constants/app";
import {isEmpty} from "lodash";

export const getAppSetup = async () => {
    let setting: AppSetup
    const buffer = await readFsAsync(APP_CONFIG_PATH)
    if (buffer == null || isEmpty(buffer.toString())) {
        setting = null
    } else {
        setting = JSON.parse(buffer.toString())
    }
    return setting
}
