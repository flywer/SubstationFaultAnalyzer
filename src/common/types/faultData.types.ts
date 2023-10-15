export type FaultDataTableRow = {
    substationId: number
    substationName: string
    intervalId: number
    intervalName: string
    faultId: number
    faultName: string
    // 1:保护动作信息 2：开关变位信息
    faultType: 1 | 2
}
