export interface SearchAddressModel {
    sourceBeanList: AddressListModel[];
}

export interface AddressListModel {
    /** 地址名称 */
    mc: string;
    /** 经度 */
    lon: string;
    /** 纬度 */
    lat: string;
}

export interface ThirdFetchResult {
    msg: {
        desc: string;
        code: string;
    };
    data: ThirdResultData | ThirdResultData[];
}

export interface ThirdFetchParams {
    username: string;
    password: string;
    reg_no?: string;
    device_id?: string;
    data_type: string;
}

export interface ThirdResultData {
    [key: string]: string;
}

export interface MetaBaseModel {
    code: string;
    name: string;
    parentCode: string;
    hasChild: number;
}

export interface EnterPriseClusterResult {
    sourceBeanList: EnterpriseClusterItem[];
}
export interface EnterpriseClusterItem {
    /** 名称 */
    name: string;
    /** 数量 */
    count: number;
    /** 经度 */
    x: string;
    /** 纬度 */
    y: string;
}
