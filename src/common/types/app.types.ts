// 应用设置参数
export type AppSetup = {
    // 开机自启
    openAtLogin?: boolean
    // 关闭时隐藏到托盘
    closeAsHidden?: boolean
    // 启用系统托盘
    enableSysTray?: boolean
    // 自定义主题: followSys:跟随系统主题
    themeAccentColor?: 'followSys' | 'light' | 'dark'
    // 自动更新
    autoUpdate?: boolean
    // 更新渠道
    updateChannel?: 'Github'
    // 硬件加速
    hardwareAcceleration?: boolean
}
