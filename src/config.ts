const __DEV__ = process.env.NODE_ENV === 'development';

const BASE_NAME = __DEV__ ? '' : '/ui';
// const BASE_NAME = __DEV__ ? '' : '/ssp/ui/';
const PROXY_URL = __DEV__ ? 'http://172.16.9.123:7000/ssp/CorsProxy/proxy.ashx' : '/CorsProxy/proxy.ashx';
export { __DEV__, BASE_NAME, PROXY_URL };
