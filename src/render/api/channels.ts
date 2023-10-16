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
    },
    substation: {
        findAll: 'substation/findAll',
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
    }

})
