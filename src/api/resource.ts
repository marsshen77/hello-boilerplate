import { LegendModel } from '@/typings/esri';
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