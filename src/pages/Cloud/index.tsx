import './index.less';

import { getResPrefix } from '@/api/resource';
import { PROXY_URL } from '@/config';
import { useRequest } from 'ahooks';
import React, { useEffect, useRef, useState } from 'react';
import { loadModules } from 'esri-loader';
import { ZoomControl } from '@/components/EsriTools/Zoom';
import LayerControl from '@/components/EsriTools/LayerControl';
import SearchAddress from '@/components/EsriTools/SearchAddress';
import EnterpriseSearch from '@/components/EsriTools/EnterpriseSearch';
import { Toolbar } from '@/components/EsriTools';

type EsriModels = [
    typeof import('esri/Map'),
    typeof import('esri/views/MapView'),
    typeof import('esri/Basemap'),
    typeof import('esri/layers/TileLayer'),
    typeof import('esri/config')
];
const Cloud = () => {
    const [prefix, setPrefix] = useState<string>('');
    const [map, setMap] = useState<import('esri/Map')>();
    const [showLayer, setShowLayer] = useState(true);
    const [view, setView] = useState<import('esri/views/MapView')>();
    const { run: configRun } = useRequest(getResPrefix, { manual: true });
    useEffect(() => {
        initMap();
    }, []);
    const initMap = async () => {
        const prefix = (await configRun()).data;
        const [Map, MapView, BaseMap, TileLayer, esriConfig] = await (loadModules([
            'esri/Map',
            'esri/views/MapView',
            'esri/Basemap',
            'esri/layers/TileLayer',
            'esri/config'
        ]) as Promise<EsriModels>);
        esriConfig.request.proxyUrl = PROXY_URL;

        const map = new Map({
            basemap: new BaseMap({
                baseLayers: [new TileLayer({ url: `${prefix}/${sspConfig.MAPS.BASE_MAP}` })],
                id: '1'
            })
        });
        const view = new MapView({
            container: target.current!,
            center: [120.597011, 31.301343],
            zoom: 6,
            map
        });
        view.ui.remove('zoom');
        view.ui.remove('attribution');
        view.popup.viewModel.actions = ([] as unknown) as __esri.Collection; //去除popup内所有动作按钮
        view.popup.dockOptions.buttonEnabled = false; //去除popup右上角dock按钮
        view.popup.collapseEnabled = false; //去除点击title收缩事件
        view.popup.featureNavigationEnabled = false; //去除多个feature导航按钮

        setView(view);
        setMap(map);
        setPrefix(prefix);
    };
    const target = useRef(null);
    return (
        <div className="cloud-container">
            <div className="map-container" ref={target}></div>
            <Toolbar
                view={view}
                map={map}
                onLayerVisibleChange={(show) => setShowLayer(show)}
                layerVisible={showLayer}
            />
            <SearchAddress prefix={prefix} map={map} view={view} />
            <ZoomControl view={view} map={map} prefix={prefix} />
            <LayerControl
                prefix={prefix}
                map={map}
                show={showLayer}
                onClose={() => setShowLayer(false)}
            />
            <EnterpriseSearch map={map} view={view} prefix={prefix} />
        </div>
    );
};

export default Cloud;
