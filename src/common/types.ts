export type Nullable<T> = T | null

export type Voidable<T> = T | null | undefined

export interface IpcResponse<T> {
    data?: T
    error?: any
}

/**
 * 文件路径类型
 **/
export enum FilePathType {
    file,
    dir,
    unknown,
}
