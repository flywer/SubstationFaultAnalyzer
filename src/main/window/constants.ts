import {app} from "electron";
import {join} from "path";

export const MAIN_WINDOW = 'main-window'

const isDev = !app.isPackaged

export const MAIN_WINDOW_URL = isDev
    ? process["env"]["DS_RENDERER_URL"] + '/#/mainPage'
    : `file://${join(app.getAppPath(), 'dist/render/index.html')}#/mainPage`
