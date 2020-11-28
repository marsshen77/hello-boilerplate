import './index.less';
import locate_default_icon from './images/icon_locate.png';
import search_img from './images/susong-search@2x.png';
import advanced_search_img from './images/高级搜索@2x.png';

import { useRequest } from 'ahooks';
import React, { useRef } from 'react';
import { useState } from 'react';
import { Pagination } from '@material-ui/lab';
import { Button, IconButton, InputBase } from '@material-ui/core';
import { CancelRounded } from '@material-ui/icons';
import { EsriMap, EsriView } from '@/typings/esri';
import { loadModules } from 'esri-loader';
import { searchAddress } from '@/api/resource';
import { AddressListModel } from '@/typings/resource';

type SearchAddressEsriModels = [
    typeof import('esri/Graphic'),
    typeof import('esri/geometry/Point'),
    typeof import('esri/layers/GraphicsLayer'),
    typeof import('esri/tasks/GeometryService'),
    typeof import('esri/tasks/support/ProjectParameters')
];
interface SearchProps {
    map?: EsriMap;
    view?: EsriView;
    /** 是否显示高级搜索 */
    advanced?: boolean;
}
const PAGE_SIZE = 7;
const SearchAddress = (props: SearchProps) => {
    const LAYER_ID = 'search-address-layer';
    const { map, view, advanced = false } = props;
    const [value, setValue] = useState('');
    const [pageIndex, setPageIndex] = useState(1);
    const [show, setShow] = useState(false);
    const [a_show, setA_show] = useState(false);
    const layerRef = useRef<__esri.GraphicsLayer>();
    const handleClick = async (item: AddressListModel) => {
        if (map && view) {
            const [
                Graphic,
                Point,
                GraphicsLayer,
                GeometryService,
                ProjectParameters
            ] = await (loadModules([
                'esri/Graphic',
                'esri/geometry/Point',
                'esri/layers/GraphicsLayer',
                'esri/tasks/GeometryService',
                'esri/tasks/support/ProjectParameters'
            ]) as Promise<SearchAddressEsriModels>);
            let layer = map.findLayerById(LAYER_ID) as __esri.GraphicsLayer;
            if (layer) layer.removeAll();
            else {
                layer = new GraphicsLayer({ id: LAYER_ID });
                layerRef.current = layer;
                map.add(layer);
            }
            layer.removeAll();
            const point = new Point({
                longitude: Number(item.lon),
                latitude: Number(item.lat),
                spatialReference: ({
                    wkid: '4326'
                } as unknown) as __esri.SpatialReference
            });
            const geometryService = new GeometryService({
                url:
                    'http://172.16.9.114:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer'
            });
            const prjParams = new ProjectParameters({
                geometries: [point],
                outSpatialReference: view.spatialReference
            });

            const result = await geometryService.project(prjParams);
            const symbol = {
                type: 'picture-marker',
                url: locate_default_icon,
                height: '34px',
                width: '28px'
            } as __esri.SymbolProperties;
            const graphic = new Graphic({
                geometry: result[0],
                symbol
            });
            await view.goTo(result[0], { duration: 400 });
            layer.add(graphic);
        }
    };
    const handleClearText = () => {
        setValue('');
        setShow(false);
        layerRef.current?.removeAll();
    };
    const { data: result, run } = useRequest(searchAddress, {
        manual: true,
        ready: !!value.trim(),
        onSuccess: () => {
            setShow(true);
        }
    });
    const handleSearch = () => {
        setPageIndex(1);
        run(value);
    };
    const getItems = () => {
        if (!show) return null;
        const data = result?.data;
        return data?.slice((pageIndex - 1) * PAGE_SIZE, pageIndex * PAGE_SIZE).map((item) => (
            <li key={item.mc} onClick={() => handleClick(item)}>
                <img src={locate_default_icon} />
                <span className="info">
                    <span className="address">{item.mc}</span>
                </span>
            </li>
        ));
    };
    return (
        <div className="address-search-bar-container">
            <div className="search-bar">
                <InputBase
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value as string);
                    }}
                    className="input"
                    placeholder="搜索地点"
                    onKeyPress={(e) => e.which == 13 && handleSearch()}
                    type="text"
                />
                <IconButton
                    className="clear-input"
                    size="small"
                    onClick={handleClearText}
                    style={{ display: value ? 'block' : 'none' }}
                >
                    <CancelRounded fontSize="small" />
                </IconButton>
                <Button
                    className="button"
                    onClick={() => {
                        handleSearch();
                    }}
                >
                    <img src={search_img} alt="搜索" />
                </Button>
                {advanced && (
                    <Button
                        className="button advanced"
                        onClick={() => {
                            setA_show(!a_show);
                        }}
                    >
                        <img src={advanced_search_img} alt="高级搜索" />
                    </Button>
                )}
            </div>
            <div className="results" style={{ display: show ? 'block' : 'none' }}>
                <div className="title">查询结果列表</div>
                <div className="content">
                    <ul>{getItems()}</ul>
                </div>
                <Pagination
                    page={pageIndex}
                    classes={{ ul: 'global-pagination-ul small' }}
                    count={Math.ceil((result?.data.length || 0) / PAGE_SIZE)}
                    variant="outlined"
                    shape="rounded"
                    onChange={(_, index) => {
                        setPageIndex(index);
                    }}
                />
            </div>
            <div className="advanced-results" style={{ display: a_show ? 'block' : 'none' }}>
                <div className="title">高级搜索</div>
            </div>
        </div>
    );
};

export default SearchAddress;
