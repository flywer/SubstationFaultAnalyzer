import {Controller, IpcHandle} from 'einf'
import {channels} from "@render/api/channels";
import {failure, Result, success} from "@main/vo/resultVo";
import {autoUpdater} from "electron-updater";
import log from "electron-log";

@Controller()
export class AppController {
    constructor() {
    }

    @IpcHandle(channels.app.getAppVersion)
    public handleGetAppVersion() {
        let result: Result<string>
        try {
            result = success()
            result.data = autoUpdater.currentVersion.version
        } catch (e) {
            log.error(e)
            result = failure()
            result.data = e
        }
        return result
    }
}
