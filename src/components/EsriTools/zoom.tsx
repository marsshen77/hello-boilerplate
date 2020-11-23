import './index.less';
import basemap_img from './images/diqiu@2x.png';
import zoom_in_img from './images/zoom-in@2x.png';
import zoom_out_img from './images/zoom-out@2x.png';
import vector_img from './images/vector.png';

import { loadModules } from 'esri-loader';
import React, { useRef, useState } from 'react';
import { Popover } from '@material-ui/core';

type ZoomEsriModels = [typeof import('esri/Basemap'), typeof import('esri/layers/TileLayer')];
type EsriMap = __esri.Map;
type EsriView = __esri.MapView;

interface ZoomControlProps {
    view?: EsriView;
    map?: EsriMap;
    prefix: string;
}
const basemapItems = [{ id: '1', slt: vector_img, dz: '/szdzdt2019_2000', mc: '苏州电子地图' }];
export const ZoomControl = (props: ZoomControlProps) => {
    const { view, map, prefix } = props;
    const baseMapRef = useRef(null);
    const [open, setOpen] = useState(false);
    if (!view) return null;
    const handleZoom = (zoomIn: boolean) => {
        view.goTo({
            zoom: view.zoom + (zoomIn ? -1 : 1)
        });
    };
    const getBaseMapItems = () => {
        if (basemapItems && basemapItems?.length > 0) {
            return basemapItems?.map((item) => (
                <img
                    src={item.slt}
                    key={item.id}
                    alt=""
                    className={map?.basemap.id === item.id ? 'selected' : ''}
                    onClick={async () => {
                        if (map) {
                            const [BaseMap, TileLayer] = await (loadModules([
                                'esri/Basemap',
                                'esri/layers/TileLayer'
                            ]) as Promise<ZoomEsriModels>);
                            map.basemap = new BaseMap({
                                baseLayers: [new TileLayer({ url: prefix + item.dz })],
                                title: item.mc,
                                id: item.id
                            });
                            setOpen(false);
                        }
                    }}
                />
            ));
        } else {
            return null;
        }
    };
    return (
        <div className="zoom-control-container">
            {basemapItems && (
                <span ref={baseMapRef} onClick={() => setOpen(!open)}>
                    <img className="basemap-icon" src={basemap_img} alt="" />
                </span>
            )}
            <span onClick={() => handleZoom(false)}>
                <img src={zoom_out_img} alt="" />
            </span>
            <span onClick={() => handleZoom(true)}>
                <img src={zoom_in_img} alt="" />
            </span>
            <Popover
                open={open}
                anchorEl={baseMapRef.current}
                onClose={() => setOpen(false)}
                classes={{ paper: 'basemap-select-container' }}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
            >
                <div>{getBaseMapItems()}</div>
            </Popover>
        </div>
    );
};
