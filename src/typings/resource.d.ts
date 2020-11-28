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
