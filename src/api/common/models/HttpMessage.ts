import { HttpStatusCode } from "../../../enums/HttpStatusCode"

/**
 * @type HttpMessage
 * HttpMessage model type for returning data from the given request.
 * status: any of the HTTP status protocol codes, given in the enum of HttpStatusCode
 * msg: An optional message sended by the server to the one doing the request
 * data: An optional attribute that will be the type of T which can be an array of entities or the
 * entity itself.
 */
export type HttpMessage<T> = {
    status: HttpStatusCode,
    msg?: string,
    data?: T[] | T
}

/**
 * @type ErrorHttpMessage
 * ErrorHttpMessage model type for returning printing errors or bad requests done
 * status: any of the HTTP status protocol codes, given in the enum of HttpStatusCode
 * msg: An optional message sended by the server to the one doing the request, such as the error message
 * stack: If an error is produced send the stack of the error. This should be EXCLUSIVELY done during development stages,
 * not in any production srever
 */
export type ErrorHttpMessage = {
    status: HttpStatusCode,
    msg: string,
    stack?: string,
}
