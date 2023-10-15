import {Controller, IpcHandle, Window} from "einf";
import {channels} from "@render/api/channels";
import {BrowserWindow} from "electron";
import {MAIN_WINDOW} from "@main/window/constants";
import {getAppSetup} from "@common/utils/appConfigUtils";

@Controller()
export class WindowController {
    constructor(
        @Window(MAIN_WINDOW) private readonly mainWindow: BrowserWindow, // 主窗口实例
    ) {
    }

    @IpcHandle(channels.window.max)
    public windowMax() {
        if (this.mainWindow.isMaximized())
            this.mainWindow.restore()
        else
            this.mainWindow.maximize()
    }

    @IpcHandle(channels.window.min)
    public windowMin() {
        this.mainWindow.minimize()
    }

    @IpcHandle(channels.window.close)
    public async windowClose() {
        const setup = await getAppSetup()
        if (setup != null && setup.closeAsHidden) {
            this.mainWindow.hide()
        } else {
            this.mainWindow.close()
        }
    }

    @IpcHandle(channels.window.top)
    public async windowTop(value: boolean) {
        this.mainWindow.setAlwaysOnTop(value)
    }

}
