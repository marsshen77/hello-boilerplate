import { RendererType, MarkerSymbolType } from '@/components/MapTools';

export interface Result<T> {
    state: boolean;
    code: number;
    message?: string;
    total?: number;
    data: T;
}
export interface RequestError {
    code: number;
    message?: string;
}

export interface PageHeader {
    pageIndex: number;
    pageSize: number;
}

export interface UploadFileModel {
    id: string;
    urls: { url: string; name: string }[];
}