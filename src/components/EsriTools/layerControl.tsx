import './index.less';
import layer_title_icon from './images/tuceng-title@2x.png';
import collapse_icon from './images/collapse.png';
import close_icon from './images/guanbi@2x.png';

import { EsriMap } from '@/typings/esri';
import { Checkbox, Collapse, FormControlLabel } from '@material-ui/core';
import { CheckBoxOutlined } from '@material-ui/icons';
import { loadModules } from 'esri-loader';
import React, { useRef, useState } from 'react';
import { LegendServer } from './Legend';
import { getBasicInfo } from '@/api/resource';
import { useRequest } from 'ahooks';
import { ThirdResultData } from '@/typings/resource';

interface LayerInfo {
    title: string;
    url: string;
    tch: number;
    id: string;
    cluster?: boolean;
    fields?: [string, string][];
    promisePopup?: boolean;
}
interface LayerGroup {
    title: string;
    layers?: LayerInfo[];
}
const LayerData: LayerGroup[] = [
    {
        title: '专题图层',
        layers: [
            {
                title: '特种设备',
                url: 'TZSB/MapServer',
                tch: 0,
                id: '2',
                cluster: true,
                promisePopup: true
            }
        ]
    },
    {
        title: '应急资源',
        layers: [
            {
                title: '救援队伍',
                url: 'SJGIS_YJZY/MapServer',
                tch: 0,
                id: '3',
                fields: [
                    ['名称', 'TEAMNAME'],
                    ['联系人', 'CONTACTPER'],
                    ['办公电话', 'CONTACTOTEL'],
                    ['所属单位', 'CHARGEDEPT'],
                    ['地址', 'ADDRESS']
                ]
            },
            {
                title: '避难场所',
                url: 'SJGIS_YJZY/MapServer',
                tch: 1,
                id: '4',
                fields: [
                    ['名称', 'ASYLUMAREANAME'],
                    ['联系人', 'CONTACTPER'],
                    ['办公电话', 'CONTACTOTEL'],
                    ['所属单位', 'CHARGEDEPT'],
                    ['地址', 'ADDRESS']
                ]
            },
            {
                title: '防护目标',
                url: 'SJGIS_YJZY/MapServer',
                tch: 2,
                id: '5',
                cluster: true,
                fields: [
                    ['名称', 'DEFOBJNAME'],
                    ['联系人', 'CONTACTPER'],
                    ['办公电话', 'CONTACTOTEL'],
                    ['所属单位', 'CHARGEDEPT'],
                    ['地址', 'ADDRESS']
                ]
            },
            {
                title: '消防单位',
                url: 'SJGIS_YJZY/MapServer',
                tch: 3,
                id: '6',
                fields: [
                    ['名称', 'TEAMNAME'],
                    ['联系人', 'CONTACTPER'],
                    ['办公电话', 'CONTACTOTEL'],
                    ['所属单位', 'CHARGEDEPT'],
                    ['地址', 'ADDRESS']
                ]
            },
            {
                title: '消防设施',
                url: 'SJGIS_YJZY/MapServer',
                tch: 4,
                id: '7',
                cluster: true,
                fields: [
                    ['名称', 'DEFOBJNAME'],
                    ['联系人', 'CONTACTPER'],
                    ['办公电话', 'CONTACTOTEL'],
                    ['所属单位', 'CHARGEDEPT'],
                    ['地址', 'ADDRESS']
                ]
            },
            {
                title: '医疗卫生',
                url: 'SJGIS_YJZY/MapServer',
                tch: 5,
                id: '8',
                fields: [
                    ['名称', 'HEALTHNAME'],
                    ['联系人', 'CONTACTPER'],
                    ['办公电话', 'CONTACTOTEL'],
                    ['所属单位', 'CHARGEDEPT'],
                    ['地址', 'ADDRESS']
                ]
            }
        ]
    },
    {
        title: '行政区划',
        layers: [
            {
                title: '区县',
                url: 'BaseMap_SZXZQH/MapServer',
                tch: 2,
                id: '10'
            },
            {
                title: '镇',
                url: 'BaseMap_SZXZQH/MapServer',
                tch: 1,
                id: '11'
            },
            {
                title: '村',
                url: 'BaseMap_SZXZQH/MapServer',
                tch: 0,
                id: '12'
            }
        ]
    }
];

interface LayerControlProps {
    map?: EsriMap;
    show?: boolean;
    onClose?: () => void;
    onServerChange?: (servers: LegendServer[]) => void;
    prefix: string;
}
const LayerControl = (props: LayerControlProps) => {
    const { show = true, onClose, map, onServerChange, prefix } = props;
    const serverVisible = useRef<LegendServer[]>([]);
    if (!prefix) return null;
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
                    data={item}
                    map={map}
                    prefix={prefix}
                />
            ));
        return null;
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
interface LayerItemProps {
    data: LayerGroup;
    map: EsriMap;
    onVisibleChange: (server: LegendServer) => void;
    prefix: string;
}
const LayerItem = (props: LayerItemProps) => {
    const { data, map, prefix } = props;
    const [show, setShow] = useState(false);
    const [subCheck, setSubCheck] = useState<boolean[]>(
        data.layers ? data.layers.map((_) => false) : [false]
    );
    const { run: runInfo } = useRequest(getBasicInfo, { manual: true });

    const handleChange = (index: number, checked: boolean, layerInfo: LayerInfo) => {
        if (map && prefix) {
            const temp = [...subCheck];
            temp[index] = checked;
            setSubCheck(temp);
            setLayerVisible(layerInfo, checked);
        }
    };

    const getPromiseContent = async (target: any) => {
        console.log(target);
        const body = {
            username: sspConfig.THIRD_API.username,
            password: sspConfig.THIRD_API.password,
            reg_no: '',
            device_id: (target.graphic.attributes.SBID as string).trim(),
            data_type: '特种设备-设备'
        };
        const result = await runInfo(body);
        if (result.msg.code === '0') {
            const data = result.data as ThirdResultData;
            return `<div class="custom-popup-content">${Object.keys(result.data)
                .map(
                    (item) =>
                        `<div><span class="name">${item}：</span><span class="value">${data[item]}</span></div>`
                )
                .join('')}</div>`;
        } else {
            return `<div class="custom-popup-content">信息未找到</div>`;
        }
    };

    const setLayerVisible = async (layerInfo: LayerInfo, checked: boolean) => {
        let layer = map.findLayerById(layerInfo.id);
        if (layer) {
            layer.visible = checked;
        } else {
            const fields = layerInfo.fields;
            const [FeatureLayer] = await (loadModules([
                'esri/layers/FeatureLayer'
            ]) as Promise<LayerControlEsriModels>);
            let url = `${prefix}/${layerInfo.url}/${layerInfo.tch}`;
            const featureLayer = new FeatureLayer({ url, id: layerInfo.id });
            if (layerInfo.cluster) {
                const clusterConfig = {
                    type: 'cluster',
                    clusterRadius: '400px',
                    clusterMinSize: '24px',
                    clusterMaxSize: '60px',
                    labelingInfo: [
                        {
                            deconflictionStrategy: 'none',
                            labelExpressionInfo: {
                                expression: "Text($feature.cluster_count, '#,###')"
                            },
                            symbol: {
                                type: 'text',
                                color: '#0b4000',
                                font: {
                                    weight: 'bold',
                                    family: 'Noto Sans',
                                    size: '14px'
                                },
                                haloColor: 'white',
                                haloSize: '1px'
                            },
                            labelPlacement: 'center-center'
                        }
                    ]
                };
                featureLayer.featureReduction = (clusterConfig as unknown) as __esri.FeatureReductionCluster;
                featureLayer.renderer = ({
                    type: 'simple',
                    field: 'mag',
                    symbol: {
                        type: 'simple-marker',
                        size: 10,
                        color: 'rgba(29,174,0,0.3)',
                        outline: {
                            color: 'rgba(29,174,0,0.15)',
                            width: 10
                        }
                    }
                } as unknown) as __esri.Renderer;
            }
            if (fields && fields.length > 0)
                featureLayer.popupTemplate = {
                    title: layerInfo.title,
                    content: `<div class="custom-popup-content">${fields
                        .map(
                            (item) =>
                                `<div><span class="name">${item[0]}：</span><span class="value">{${item[1]}}</span></div>`
                        )
                        .join('')}</div>`
                } as __esri.PopupTemplate;

            if (layerInfo.promisePopup) {
                featureLayer.outFields = ['SBID', 'SBSYDD'];
                featureLayer.popupTemplate = ({
                    title: layerInfo.title,
                    content: getPromiseContent
                } as unknown) as __esri.PopupTemplate;
            }

            if (featureLayer) map.add(featureLayer);
        }
    };

    return (
        <li>
            <div className="label">
                <span onClick={() => data.layers && setShow(!show)}>{data.title}</span>
                {data.layers && <img className={show ? 'show' : ''} src={collapse_icon} alt="" />}
            </div>
            <Collapse in={show}>
                <ul>
                    {data.layers?.map((layer, index) => (
                        <li key={layer.url + layer.tch}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={(_, checked) =>
                                            handleChange(index, checked, layer)
                                        }
                                        checkedIcon={<CheckBoxOutlined />}
                                        classes={{ checked: 'checked' }}
                                        size="small"
                                        color="primary"
                                    />
                                }
                                label={layer.title}
                            />
                        </li>
                    ))}
                </ul>
            </Collapse>
        </li>
    );
};

export default LayerControl;
