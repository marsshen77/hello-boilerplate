import './index.less';
import layer_title_icon from './images/tuceng-title@2x.png';
import collapse_icon from './images/collapse.png';
import close_icon from './images/guanbi@2x.png';

import { EsriMap } from '@/typings/esri';
import { AddMyDesktopResParams, MyDesktopLayer, MyDesktopResModel } from '@/typings/resource';
import { Button, Checkbox, Collapse, FormControlLabel, MenuItem, Popover } from '@material-ui/core';
import { CheckBoxOutlined, RemoveCircle } from '@material-ui/icons';
import { useRequest } from 'ahooks';
import { loadModules } from 'esri-loader';
import React, { useRef, useState } from 'react';
import { LegendServer } from './legend';

const LayerData = [
    {
        title: '专题图层',
        layers: [
            {
                title: '企业法人',
                url: 'FRKDZ/MapServer/0'
            },
            {
                title: '特种设备',
                url: 'TZSB/MapServer/0'
            }
        ]
    },
    { title: '行政区划' }
];

interface LayerControlProps {
    map?: EsriMap;
    show?: boolean;
    onClose?: () => void;
    token: string;
    onServerChange?: (servers: LegendServer[]) => void;
}
export const LayerControl = (props: LayerControlProps) => {
    const { show = true, onClose, map, token, onServerChange } = props;
    const serverVisible = useRef<LegendServer[]>([]);
    if (!token) return null;
    const handleVisibleChange = (server: LegendServer) => {
        const index = serverVisible.current.findIndex((item) => item.id === server.id);
        if (~index) {
            serverVisible.current[index] = server;
        } else {
            serverVisible.current.push(server);
        }
        onServerChange && onServerChange(serverVisible.current);
    };
    const getItems = () => {
        if (map)
            return LayerData.map((item) => (
                <LayerItem
                    key={item.title}
                    onVisibleChange={handleVisibleChange}
                    token={token}
                    data={item}
                    map={map}
                />
            ));
    };
    return (
        <div className="desktop-layer-control" style={{ display: show ? 'block' : 'none' }}>
            <div className="esri-blue-title">
                <img className="layer-icon" src={layer_title_icon} alt="" />
                <span>图层控制</span>
                <img
                    className="close-icon"
                    src={close_icon}
                    alt=""
                    onClick={() => onClose && onClose()}
                />
            </div>
            <div className="content">
                <ul>{getItems()}</ul>
            </div>
        </div>
    );
};
type LayerControlEsriModels = [typeof import('esri/layers/FeatureLayer')];
type ServerControlEsriModels = [
    typeof import('esri/layers/TileLayer'),
    typeof import('esri/layers/MapImageLayer')
];
interface LayerItemProps {
    token?: string;
    data: MyDesktopResModel;
    map: EsriMap;
    onVisibleChange: (server: LegendServer) => void;
}
const LayerItem = (props: LayerItemProps) => {
    const { data, map, token, onVisibleChange } = props;
    const serverUrl = `${sspConfig.MAP_ROOT}/${token}/${data.dz}`;
    const [show, setShow] = useState(false);

    const handleChange = (index: number, checked: boolean, layerInfo: MyDesktopLayer) => {
        if (map && token) {
            const temp = [...subCheck];
            temp[index] = checked;
            setLayerVisible(layerInfo, checked);
            onVisibleChange({
                id: data.id,
                name: data.mc,
                url: serverUrl,
                visible: temp.reduce((check, item) => check || item, false),
                layers: data.tc
                    ? data.tc.map((item, index) => ({
                          tch: Number(item.tch),
                          visible: temp[index]
                      }))
                    : []
            });
        }
    };
    const handleTotalChange = (checked: boolean) => {
        if (map && token) {
            if (data.tc) {
                const temp = data.tc.map((_) => checked);
                data.tc.forEach((layerInfo) => {
                    setLayerVisible(layerInfo, checked);
                });
                onVisibleChange({
                    id: data.id,
                    name: data.mc,
                    url: serverUrl,
                    visible: checked,
                    layers: data.tc
                        ? data.tc.map((item) => ({ tch: Number(item.tch), visible: checked }))
                        : []
                });
            } else {
                setMapServerVisible(checked);
                onVisibleChange({
                    id: data.id,
                    name: data.mc,
                    url: serverUrl,
                    visible: checked,
                    layers: []
                });
            }
        }
    };

    const setLayerVisible = async (layerInfo: MyDesktopLayer, checked: boolean) => {
        let layer = map.findLayerById(layerInfo.id);
        if (layer) {
            layer.visible = checked;
        } else {
            const fields = (await runField(layerInfo.id)).data;
            const [FeatureLayer] = await (loadModules([
                'esri/layers/FeatureLayer'
            ]) as Promise<LayerControlEsriModels>);
            let url = `${serverUrl}/${layerInfo.tch}`;
            const featureLayer = new FeatureLayer({ url, id: layerInfo.id });
            if (fields && fields.length > 0)
                featureLayer.popupTemplate = {
                    title: `{${fields[0].mc}}`,
                    content: `<div class="custom-popup-content">${fields
                        .slice(1)
                        .map(
                            (item) =>
                                `<div><span class="name">${item.bm}：</span><span class="value">{${
                                    item.mc
                                }}${item.hz || ''}</span></div>`
                        )
                        .join('')}</div>`
                } as __esri.PopupTemplate;

            if (featureLayer) map.add(featureLayer);
        }
    };
    const setMapServerVisible = async (checked: boolean) => {
        let layer = map.findLayerById(data.id);
        if (layer) {
            layer.visible = checked;
        } else {
            const [TileLayer, MapImageLayer] = await (loadModules([
                'esri/layers/TileLayer',
                'esri/layers/MapImageLayer'
            ]) as Promise<ServerControlEsriModels>);
            let url = serverUrl;
            if (data.lx === 'MapServer') {
                const imageLayer = new MapImageLayer({ url, id: data.id });
                map.add(imageLayer);
            }
            if (data.lx === 'Tile') {
                const tileLayer = new TileLayer({ url, id: data.id });
                map.add(tileLayer);
            }
        }
    };
    return (
        <li>
            <div className="label">
                <span onClick={() => data.tc && setShow(!show)}>{data.mc}</span>
                {data.tc && <img className={show ? 'show' : ''} src={collapse_icon} alt="" />}
            </div>
            <Collapse in={show}>
                <ul>
                    {data.tc?.map((layer, index) => (
                        <li key={layer.tch}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={subCheck[index]}
                                        onChange={(_, checked) =>
                                            handleChange(index, checked, layer)
                                        }
                                        checkedIcon={<CheckBoxOutlined />}
                                        classes={{ checked: 'checked' }}
                                        size="small"
                                        color="primary"
                                    />
                                }
                                label={layer.mc}
                            />
                        </li>
                    ))}
                </ul>
            </Collapse>
        </li>
    );
};
