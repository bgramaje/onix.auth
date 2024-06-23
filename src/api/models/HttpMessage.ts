export type ErrorHttpMessage = {
    status: number,
    msg: string,
    stack?: string,
}

export type HttpMessage = {
    status: number,
    data?: any[]
    msg?: string,
}
