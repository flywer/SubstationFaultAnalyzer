export class Result<T> {
    /*结果标识*/
    tag: number
    /*成功标识*/
    success: boolean
    /*返回消息*/
    message: string
    /*返回数据对象*/
    data: T
}

export const success = (message?: string): Result<any> => {
    let result = new Result();
    result.success = true
    result.tag = 200
    if (message != null) {
        result.message = message
    } else {
        result.message = "成功"
    }
    return result
}

export const failure = (message?: string): Result<any> => {
    let result = new Result();
    result.success = false
    result.tag = 500
    if (message != null) {
        result.message = message
    } else {
        result.message = "失败"
    }
    return result
}
