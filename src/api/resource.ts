import { LegendModel } from '@/typings/esri';
import {
    AddressListModel,
    EnterPriseClusterResult,
    MetaBaseModel,
    ThirdFetchParams,
    ThirdFetchResult
} from '@/typings/resource';
import sspFetch, { jsonpFetch, thirdFetch } from './fetch';
const path = `${sspConfig.API_ROOT}/resource/`;

/**
 * 获取资源服务前缀
 */
export const getResPrefix = () => sspFetch<string>({ url: path + 'getResPrefix' });

/**
 * 获取图层图例
 * @param url
 */
export const getArcgisLegend = (url: string) => jsonpFetch<LegendModel>(url + '/legend?f=pjson');

/**
 * 地址搜索
 * @param keyword 搜索关键字
 */
export const searchAddress = (keyword: string) =>
    sspFetch<AddressListModel[]>({ url: `${path}searchAddress?keyword=${keyword}` });

/**
 * 获取基本信息
 * @param data
 */
export const getBasicInfo = (data: ThirdFetchParams) =>
    thirdFetch<ThirdFetchResult>(sspConfig.THIRD_API.url, 'POST', data);

/**
 * 获取国民经济分类
 * @param parentCode
 */
export const getIndustryList = (parentCode: string) =>
    sspFetch<MetaBaseModel[]>({ url: `${path}getIndustryList?parentCode=${parentCode}` });

/**
 * 获取字典列表
 * @param parentCode
 */
export const getMetaBaseList = (category: string, parentCode: string) =>
    sspFetch<MetaBaseModel[]>({
        url: `${path}getMetaBaseList?category=${category}&parentCode=${parentCode}`
    });

/**
 * 获取企业聚合数据
 * @param key
 */
export const getEnterpriseCluster = (key: string) =>
    sspFetch<EnterPriseClusterResult>({ url: `/test.json` });
