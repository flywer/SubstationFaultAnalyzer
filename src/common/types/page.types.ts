export type PageVo = {
    pageNo: number,
    pageSize: number,
    searchParam: string
}

export type PageResult<T> = {
    records: T[],
    total: number
}
