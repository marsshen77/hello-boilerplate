const __DEV__ = process.env.NODE_ENV === 'development';

// const BASE_NAME = __DEV__ ? '' : '/ssp/visual_market';
const BASE_NAME = __DEV__ ? '' : '/ui';
const PROXY_URL = __DEV__
    ? 'http://172.16.9.123:7000/ssp/CorsProxy/proxy.ashx'
    : 'http://2.46.1.43:81/CorsProxy/proxy.ashx';
export { __DEV__, BASE_NAME, PROXY_URL };
