declare const sspConfig: {
    /** 接口根路径 */
    API_ROOT: string;
    /** gis代理服务器根路径 */
    MAP_ROOT: string;
    /** 附件根路径 */
    FILE_ROOT: string;
    /** 三方接口 */
    THIRD_API: {
        url: string;
        username: string;
        password: string;
    };
    MAPS: {
        /** 底图服务 */
        BASE_MAP: string;
    };
    ESRI_ROOT: {
        url: string;
        css: string;
    };
};
