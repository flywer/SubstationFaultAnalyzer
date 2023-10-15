import {defineStore} from "pinia";
import {AppSetup} from "@common/types/app.types";

export const useAppSettingsStore = defineStore({
    id: 'appSettings',
    state: () => ({
        setup: {
            openAtLogin: false,
            closeAsHidden: false,
            enableSysTray: false,
            themeAccentColor: 'followSys',
            autoUpdate: false,
            updateChannel: 'Github',
            hardwareAcceleration: true
        } as AppSetup,
    }),
})
