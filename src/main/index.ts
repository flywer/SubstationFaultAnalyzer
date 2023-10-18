import {app} from 'electron'
import {createEinf} from 'einf'
import {AppController} from '@main/controller/app.controller'
import {WindowController} from "@main/controller/window.controller";
import {createWindow} from "@main/window/windowManager";
import log from 'electron-log'
import {appLogInit} from "../app/app.log";
import fs from "fs";
import {join} from "path";
import {APP_DATA_PATH} from "../constants/app";
import {AppDataSource} from "@main/dataSource/app-data-source";
import {FaultDataController} from "@main/controller/faultData.controller";
import {SubstationController} from "@main/controller/substation.controller";
import {ProActController} from "@main/controller/proAct.controller";
import {SwitchPosController} from "@main/controller/switchPos.controller";
import {IntervalController} from "@main/controller/interval.controller";
import {tray, trayInit} from "../app/app.tray";
import {getAppSetup} from "@common/utils/appConfigUtils";

process["env"].ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

async function electronAppInit() {

    const isDev = !app.isPackaged

    //设置操作系统全局名称
    app.setAppUserModelId('SubstationFaultAnalyzer')
    // 禁用缓存
    app.commandLine.appendSwitch('--disable-http-cache')

    ///应用启动后的操作
    app.whenReady().then(async () => {
        const setup = await getAppSetup()
        if (setup != null && setup.enableSysTray) {
            trayInit()
        }
        /* if (setup != null && setup.autoUpdate) {
             handleAutoUpdate()
         }*/
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.exit()
            if (tray != null) {
                tray.destroy()
            }
        }

    })

    if (isDev) {
        if (process.platform === 'win32') {
            process.on('message', (data) => {
                if (data === 'graceful-exit')
                    app.exit()
            })
        } else {
            process.on('SIGTERM', () => {
                app.exit()
            })
        }
    }
}

async function bootstrap() {
    try {
        appLogInit()

        appDataFolderInit()

        await electronAppInit()

        app.whenReady().then(async () => {
            await createEinf({
                window: createWindow(),
                controllers: [
                    AppController,
                    WindowController,
                    FaultDataController,
                    SubstationController,
                    ProActController,
                    SwitchPosController,
                    IntervalController
                ],
                injects: [{
                    name: 'IS_DEV',
                    inject: !app.isPackaged,
                }],
            })
        })


        AppDataSource.initialize().then(async () => {
            log.info("应用程序数据源连接初始化成功")

        }).catch(error => log.error('应用程序数据源连接失败', error))

    } catch (error) {
        log.error(error)
        app.quit()
    }
}

bootstrap()

/**
 * 创建cron、config文件夹，防止不存在报错
 */
function appDataFolderInit() {
    fs.mkdir(join(APP_DATA_PATH, 'config'), {recursive: true}, (error) => {
        if (error) log.error(error)
    })
}
