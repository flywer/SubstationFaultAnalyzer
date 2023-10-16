import {join} from 'path'
import {BrowserWindow, app} from 'electron'
import log from 'electron-log'
import {MAIN_WINDOW_URL} from '@main/window/constants'

const isDev = !app.isPackaged

export const createMainWindow = (): BrowserWindow => {
    const win = new BrowserWindow({
        width: 1300,
        minWidth:625,
        height: 781,
        minHeight:360,
        frame: false, // 无边框
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: join(__dirname, '../preload/index.js'),
            devTools: isDev,
            webSecurity: false,// 允许跨域访问
            // nodeIntegration: false, // 允许 Node.js APIs 在渲染进程中使用
            // nodeIntegrationInWorker: true, // 允许 Node.js APIs 在 Web Worker 中使用（仅 Electron 5+）
            //  nodeIntegrationInSubFrames: true // 允许 Node.js APIs 在子 frame 中使用（仅 Electron 5+）
        },
        show: false,
        autoHideMenuBar: !isDev,
    })

    win.loadURL(MAIN_WINDOW_URL).catch(error => {
        log.error(error)
    })

    // 监听 "ready-to-show" 事件
    win.once('ready-to-show', async () => {
        win.show() // 当渲染器加载完毕时显示窗口
    });

    if (isDev) {
        win.webContents.openDevTools()
    } else {
        win.removeMenu()
    }

    win.on('closed', () => {
        win.destroy()
    })

    return win
}
