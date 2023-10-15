import {join} from "path";
import os from "os";

// 系统盘应用存储位置
export const APP_DATA_PATH = join(os.homedir(), '/AppData/Local/SubstationFaultAnalyzer')

// 操作系统的临时文件存储位置
export const APP_TEMP_DATA_PATH = join(os.tmpdir(), '/SubstationFaultAnalyzer')

// 应用源文件存储位置
export const APP_RESOURCE_PATH = !process["env"]["NODE_ENV"] || process["env"]["NODE_ENV"] === "production"
    ? process.resourcesPath // Live Mode
    : process.cwd(); // Dev Mode

// 应用设置存储位置
export const APP_CONFIG_PATH = join(APP_DATA_PATH, 'config', 'app.json')
