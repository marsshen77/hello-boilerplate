export interface LegendModel {
    layers: LayerItemInfo[];
}
export interface LayerItemInfo {
    layerId: number;
    layerName: string;
    layerType: string;
    legend: LegendItem[];
}

export interface LegendItem {
    label: string;
    url: string;
    imageData: string;
    contentType: string;
    height: number;
    width: number;
}

declare type EsriView = __esri.MapView;
declare type EsriMap = __esri.Map;
