import {reactive} from "vue";

export const channels = reactive({
    app: {
        getAppVersion: "app/getAppVersion",
        getSettings: "app/getSettings",
        updateSettings: "app/updateSettings",
        openDefaultBrowser: "app/openDefaultBrowser",
        relaunch: "app/relaunch",
        clipboard: {
            writeText: "app/clipboard/writeText",
        }
    },
    window: {
        max: 'window/max',
        min: "window/min",
        close: "window/close",
        top: "window/top"
    },
    faultData: {
        importByExcel: 'faultData/importByExcel',
        findFaultDataByPage: 'faultData/findFaultDataByPage',
        downloadTemplate: 'faultData/downloadTemplate',
        saveFaultData: 'faultData/saveFaultData',
        deleteFaultData: 'faultData/deleteFaultData',
    },
    substation: {
        findAll: 'substation/findAll',
        findBySubstationName: 'substation/findBySubstationName',
        findByIntervalId: 'substation/findByIntervalId',
        findSubstationById: 'substation/findSubstationById',
        deleteSubstationById: 'substation/deleteSubstationById',
        findSubstationByName: 'substation/findSubstationByName',
        updateNameById: 'substation/updateNameById',
    },
    proAct: {
        findAll: 'proAct/findAll',
        findProActByName: 'proAct/findProActByName',
    },
    switchPos: {
        findAll: 'switchPos/findAll',
        findSwitchPosByName: 'switchPos/findSwitchPosByName',
    },
    interval: {
        findByIntervalId: 'interval/findByIntervalId',
        findAllInterval: 'interval/findAllInterval',
        findByIntervalName: 'interval/findByIntervalName',
        deleteIntervalById: 'interval/deleteIntervalById',
        updateNameById: 'interval/updateNameById',
    }

})
