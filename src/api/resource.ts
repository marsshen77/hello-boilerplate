import { LegendModel } from '@/typings/esri';
import { AddressListModel } from '@/typings/resource';
import sspFetch, { jsonpFetch } from './fetch';
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
