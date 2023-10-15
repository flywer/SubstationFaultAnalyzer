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
        findAll: 'substation/findAll'
    },
    proAct: {
        findAll: 'proAct/findAll'
    }

})
