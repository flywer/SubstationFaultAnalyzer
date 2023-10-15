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
    },
    substation: {
        findAll: 'substation/findAll',
        findByIntervalId: 'substation/findByIntervalId',
        findSubstationById: 'substation/findSubstationById',
    },
    proAct: {
        findAll: 'proAct/findAll',
        findByIntervalId: 'proAct/findByIntervalId',
    },
    switchPos: {
        findAll: 'switchPos/findAll'
    },
    interval: {
        findByIntervalId: 'interval/findByIntervalId',
    }

})
