import {Controller, IpcHandle} from 'einf'
import {channels} from "@render/api/channels";
import {failure, Result, success} from "@main/vo/resultVo";
import {autoUpdater} from "electron-updater";
import log from "electron-log";
import {app, clipboard, shell} from "electron";
import {join} from "path";
import {APP_CONFIG_PATH, APP_DATA_PATH} from "../../constants/app";
import {jsonfileWrite, readFsSync} from "@common/utils/fsUtils";
import {isEmpty} from "lodash";
import {AppSetup} from "@common/types/app.types";
import {getAppSetup} from "@common/utils/appConfigUtils";
import {tray, trayInit} from "../../app/app.tray";

type AppSetupAlias = AppSetup

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

    @IpcHandle(channels.app.openDefaultBrowser)
    public handleOpenDefaultBrowser(link: string) {
        shell.openExternal(link).catch(error => {
            log.error(error)
        });
    }

    // 应用重启
    @IpcHandle(channels.app.relaunch)
    public handleRelaunch() {
        app.relaunch()
        app.exit(0)
    }

    @IpcHandle(channels.app.clipboard.writeText)
    public handleClipboardWriteText(text: string) {
        clipboard.writeText(text)
    }

    @IpcHandle(channels.app.getSettings)
    public async handleGetSettings() {
        try {
            let result: Result<any>
            const filePath = join(APP_DATA_PATH, 'config', 'app.json')
            const buffer = readFsSync(filePath)
            if (buffer == null || isEmpty(buffer.toString())) {
                result = success()
                result.data = null
            } else {
                result = success()
                result.data = JSON.parse(buffer.toString())
            }
            return result
        } catch (e) {
            log.error(e)
            return failure()
        }
    }

    @IpcHandle(channels.app.updateSettings)
    public async handleUpdateSettings(setupModel: AppSetupAlias) {
        try {
            const newSettings = Object.assign({}, await getAppSetup(), setupModel);

            await jsonfileWrite(APP_CONFIG_PATH, newSettings, {spaces: 2})

            /*设置开机自启*/
            //mac系统
            if (process.platform === "darwin") {
                app.setLoginItemSettings({
                    openAtLogin: newSettings?.openAtLogin || false
                });
            } else {
                app.setLoginItemSettings({
                    openAtLogin: newSettings?.openAtLogin || false
                });
            }

            /*设置是否启用托盘*/
            if (newSettings?.enableSysTray) {
                trayInit()
            } else if (tray != null) {
                tray.destroy()
            }

            /*设置主题*/
            // this.handleSendUpdateTheme()

            return success()
        } catch (e) {
            log.error(e)
            return failure()
        }
    }
}
