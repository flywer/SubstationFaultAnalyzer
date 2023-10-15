import {MAIN_WINDOW} from "@main/window/constants";
import {createMainWindow} from "@main/window/main.window";

export const createWindow = () => {
    return [
        {
            name: MAIN_WINDOW,
            win: createMainWindow()
        }
    ]
}
