import Path from "path";
import log from 'electron-log'
import {APP_TEMP_DATA_PATH} from "../constants/app";
import {getDayString} from "@common/utils/dateUtils";

// 设置日志存储位置
export const LOG_PATH = Path.join(Path.join(APP_TEMP_DATA_PATH, 'logs'), '/dct-' + getDayString() + '.log')

/**
 * 应用日志初始化
 */
export const appLogInit = () => {
    // 根据日期来存日志
    log.transports.file.resolvePath = () => LOG_PATH
}
