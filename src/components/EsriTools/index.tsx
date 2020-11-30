import './index.less';

import React, { useRef, useState } from 'react';
import { EsriMap, EsriView } from '@/typings/esri';
import { loadModules } from 'esri-loader';
import { Divider } from '@material-ui/core';

type ToolbarEsriModels = [
    typeof import('esri/layers/GraphicsLayer'),
    typeof import('esri/widgets/Sketch/SketchViewModel'),
    typeof import('esri/widgets/DistanceMeasurement2D'),
    typeof import('esri/widgets/AreaMeasurement2D')
];
interface ToolbarProps {
    map?: EsriMap;
    view?: EsriView;
    onLayerVisibleChange?: (show: boolean) => void;
    layerVisible?: boolean;
    tools?: string[];
}
type DrawStateType =
    | 'measure-line'
    | 'measure-polygon'
    | 'mark-point'
    | 'mark-line'
    | 'mark-polygon'
    | '';
type DrawType = 'polygon' | 'polyline' | 'point' | 'measure';
export const Toolbar = (props: ToolbarProps) => {
    const DRAW_LAYER_ID = 'toolbar-draw-layer';
    const {
        layerVisible = true,
        map,
        view,
        tools = ['measure', 'mark', 'layer'],
        onLayerVisibleChange
    } = props;
    const distanceRef = useRef<__esri.DistanceMeasurement2D[]>([]);
    const areaRef = useRef<__esri.AreaMeasurement2D[]>([]);
    const handleDraw = async (type: DrawStateType) => {
        let drawType: DrawType = 'measure';
        switch (type) {
            case 'mark-line':
                drawType = 'polyline';
                break;
            case 'mark-polygon':
                drawType = 'polygon';
                break;
            case 'mark-point':
                drawType = 'point';
                break;
            default:
                break;
        }
        if (map && view) {
            const [
                GraphicsLayer,
                SketchViewModel,
                DistanceMeasurement2D,
                AreaMeasurement2D
            ] = await (loadModules([
                'esri/layers/GraphicsLayer',
                'esri/widgets/Sketch/SketchViewModel',
                'esri/widgets/DistanceMeasurement2D',
                'esri/widgets/AreaMeasurement2D'
            ]) as Promise<ToolbarEsriModels>);
            let layer = map.findLayerById(DRAW_LAYER_ID) as __esri.GraphicsLayer;
            if (!layer) {
                layer = new GraphicsLayer({ id: DRAW_LAYER_ID });
                map.add(layer);
            }
            if (drawType === 'measure') {
                if (type === 'measure-line') {
                    const distanceWidget = new DistanceMeasurement2D({
                        view: view
                    });
                    distanceRef.current.push(distanceWidget);
                    distanceWidget.watch('viewModel.state', (state: string) => {
                        if (state === 'measured') setDrawState('');
                    });
                    distanceWidget.viewModel.start();
                }
                if (type === 'measure-polygon') {
                    const areaWidget = new AreaMeasurement2D({
                        view: view
                    });
                    areaRef.current.push(areaWidget);
                    areaWidget.watch('viewModel.state', (state: string) => {
                        if (state === 'measured') setDrawState('');
                    });
                    areaWidget.viewModel.start();
                }
            } else {
                const sketchVM = new SketchViewModel({
                    layer,
                    view: view,
                    pointSymbol: ({
                        type: 'simple-marker',
                        style: 'circle',
                        color: '#3ccfff',
                        size: '14px',
                        outline: {
                            width: 0
                        }
                    } as unknown) as __esri.SymbolProperties,
                    polylineSymbol: ({
                        type: 'simple-line', // autocasts as new SimpleFillSymbol
                        color: '#3ccfff',
                        width: 2,
                        cap: 'round',
                        join: 'round'
                    } as unknown) as __esri.SymbolProperties,
                    polygonSymbol: ({
                        type: 'simple-fill',
                        color: 'rgba(0,222,255,0.2)',
                        style: 'solid',
                        outline: {
                            color: '#3ccfff',
                            width: 1
                        }
                    } as unknown) as __esri.SymbolProperties
                });
                sketchVM.create(drawType);
                sketchVM.on('create', (event) => {
                    if (event.state === 'complete') {
                        setDrawState('');
                    }
                });
            }
        }
        setDrawState(type);
    };
    const [drawState, setDrawState] = useState<DrawStateType>('');
    const handleLayerControl = () => {
        const visible = !layerVisible;
        onLayerVisibleChange && onLayerVisibleChange(visible);
    };
    const handleClear = () => {
        const drawLayer = map?.findLayerById(DRAW_LAYER_ID) as __esri.GraphicsLayer;
        if (drawLayer) drawLayer.removeAll();
        distanceRef.current.forEach((widget) => {
            widget.viewModel.clear();
        });
        areaRef.current.forEach((widget) => {
            widget.viewModel.clear();
        });
        distanceRef.current = [];
        areaRef.current = [];
    };
    return (
        <div className="esri-toolbar">
            {tools.includes('measure') && (
                <>
                    <ToolbarItem
                        name="测量"
                        onClick={() => handleDraw('measure-line')}
                        icon="measure-line"
                        selected={drawState === 'measure-line'}
                    />
                    <ToolbarItem
                        name="测面"
                        onClick={() => handleDraw('measure-polygon')}
                        icon="measure-polygon"
                        selected={drawState === 'measure-polygon'}
                    />
                </>
            )}
            {tools.includes('mark') && (
                <>
                    <ToolbarItem
                        name="标点"
                        onClick={() => handleDraw('mark-point')}
                        icon="mark-point"
                        selected={drawState === 'mark-point'}
                    />
                    <ToolbarItem
                        name="标线"
                        onClick={() => handleDraw('mark-line')}
                        icon="mark-line"
                        selected={drawState === 'mark-line'}
                    />
                    <ToolbarItem
                        name="标面"
                        onClick={() => handleDraw('mark-polygon')}
                        icon="mark-polygon"
                        selected={drawState === 'mark-polygon'}
                    />
                </>
            )}
            {tools.includes('layer') && (
                <ToolbarItem
                    name="图层"
                    onClick={handleLayerControl}
                    icon="layer-control"
                    selected={layerVisible}
                />
            )}
            <ToolbarItem name="清空" onClick={handleClear} icon="clear" />
        </div>
    );
};


interface ToolbarItemProps {
    name: string;
    icon: string;
    selected?: boolean;
    onClick: () => void;
}
const ToolbarItem = (props: ToolbarItemProps) => {
    return (
        <>
            <span className={`item ${props.selected ? 'selected' : ''}`} onClick={() => props.onClick()}>
                <img className={props.icon} alt="" />
                <span className="name">{props.name}</span>
            </span>
            <Divider orientation="vertical" />
        </>
    );
};
