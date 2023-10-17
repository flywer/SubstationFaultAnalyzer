import {reactive} from "vue";

export const channels = reactive({
    app: {
        getAppVersion: "app/getAppVersion",
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
    }

})
