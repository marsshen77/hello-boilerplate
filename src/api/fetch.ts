import 'whatwg-fetch';
import fetchJsonp from 'fetch-jsonp';
import { Result, RequestError } from '@/typings/fetch';

export enum ApiResponseCode {
    OK = 200,
    AccountLoginFailed = 300,
    NotLogin = 350,
    DBConnFailed = 400,
    ServerConnFailed = 500,
    FileNotFounded = 600,
    InputArgsError = 700,
    TokenTimeout = 800,
    Other = 900
}

export enum ErrorMessage {
    NotLogin = 'NotLogin'
}

enum HttpStatusCode {
    Unauthorized = 401
}

export enum ApiRequestType {
    POST = 'POST',
    GET = 'GET'
}

interface sspFetchProps {
    url: string;
    type?: string;
    data?: any;
    headersEx?: any;
    uploadFile?: boolean;
}

/**
 * 时空大数据平台fetch总入口
 * @param props
 */
const sspFetch = async <T>(props: sspFetchProps): Promise<Result<T>> => {
    const { url, type, data, headersEx, uploadFile = false } = props;
    try {
        let headers: HeadersInit = uploadFile ? {} : { 'content-type': 'application/json' };
     
        if (headersEx) {
            headers = { ...headers, ...headersEx };
        }
        const methodType = type || (data ? ApiRequestType.POST : ApiRequestType.GET);
        const resp = await fetch(encodeURI(url), {
            body: uploadFile ? data : JSON.stringify(data),
            headers,
            method: methodType
        });
        const json: Result<T> = await resp.json();
        if (json.state) return json;
        else {
            const error: RequestError = {
                code: json.code,
                message: json.message
            };
            throw error;
        }
    } catch (e) {
        console.error(`代码：${e.code}，信息：${e.message}`);
        checkCode(e.code);
        let name = e.code;
        const errorResult = {
            ...e,
            name: name
        };
        return Promise.reject(errorResult);
    }
};

/**
 * 三方接口
 * @param url 请求路径
 * @param type 请求类型
 * @param data 请求body
 */
export const thirdFetch = async <T, U = {}>(url: string, type = 'GET', data?: U): Promise<T> => {
    try {
        // let headers: HeadersInit = { 'content-type': 'application/json' };
        const resp = await fetch(url, {
            body: JSON.stringify(data),
            // headers,
            method: type
        });
        if (!resp.ok) {
            const error = {
                code: resp.status,
                message: resp.statusText
            };
            throw error;
        } else {
            const json: T = await resp.json();
            return json;
        }
    } catch (error) {
        return Promise.reject(error);
    }
};

/**
 * jsonp fetch
 * @param url 地址，jsonp仅支持get请求
 */
export const jsonpFetch = async <T>(url: string): Promise<T> => {
    try {
        const resp = await fetchJsonp(url);
        const json: T = await resp.json();
        return json;
    } catch (e) {
        return e;
    }
};

const checkCode = (code: ApiResponseCode | HttpStatusCode) => {
    if (code === ApiResponseCode.AccountLoginFailed) {
    }
    if (code === ApiResponseCode.NotLogin) {
    }
};

export default sspFetch;
