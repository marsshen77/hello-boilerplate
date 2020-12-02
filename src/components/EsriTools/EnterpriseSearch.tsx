import './index.less';
import locate_default_icon from './images/icon_locate.png';
import advanced_search_img from './images/高级搜索@2x.png';
import close_icon from './images/guanbi@2x.png';

import React, { useState } from 'react';
import CustomInput from '../CustomInput';
import { EsriMap, EsriView } from '@/typings/esri';
import { Button, InputBase } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import EasyTable, { EasyTableColumn } from '../EasyTable';
import { loadModules } from 'esri-loader';
import { getBasicInfo } from '@/api/resource';
import { useRequest } from 'ahooks';
import { MetaBaseModel, ThirdResultData } from '@/typings/resource';
import { DictSelect } from '../FormInputs';

interface EnterpriseFormType {
    /** 企业名称 */
    name: string;
    /** 统一社会信用代码 */
    code: string;
    /** 所属管区 */
    district: string;
    /** 行政区划 */
    area: string;
    /** 所属行业 */
    industry: string;
}

type SearchEsriModels = [
    typeof import('esri/layers/FeatureLayer'),
    typeof import('esri/tasks/support/Query')
];

type LocationEsriModels = [typeof import('esri/Graphic')];

interface EnterpriseSearchProps {
    map?: EsriMap;
    view?: EsriView;
    prefix: string;
}
interface QueryResultAttribute {
    [key: string]: string | number | boolean;
}
const EnterpriseSearch = (props: EnterpriseSearchProps) => {
    const PAGE_SIZE = 5;
    const { map, view, prefix } = props;
    const [area, setArea] = useState<MetaBaseModel>();
    const [open, setOpen] = useState(true);
    const { handleSubmit, register, reset } = useForm<EnterpriseFormType>({
        defaultValues: { name: '', code: '', district: '', area: '', industry: '' }
    });
    const [page, setPage] = useState(1);
    const [currentResult, setCurrentResult] = useState<QueryResultAttribute[] | null>(null);
    const { run: runInfo } = useRequest(getBasicInfo, { manual: true });
    const onSubmit = async (data: EnterpriseFormType) => {
        if (map && view) {
            const [FeatureLayer, Query] = await (loadModules([
                'esri/layers/FeatureLayer',
                'esri/tasks/support/Query'
            ]) as Promise<SearchEsriModels>);
            const featureLayer = new FeatureLayer({ url: `${prefix}/FRKDZ/MapServer/0` });
            const query = new Query();
            let sql = '';
            if (data.name) sql += `CORP_NAME like '%${data.name}%'`;
            if (data.code) sql += (sql ? ' and ' : '') + `UNI_SC_ID like '%${data.code}%'`;
            if (data.district) sql += (sql ? ' and ' : '') + `ORGAN_NAME like '%${data.district}%'`;
            if (area?.code) sql += (sql ? ' and ' : '') + `AREA_CODE = '%{area?.code}'`;
            if (data.industry)
                sql += (sql ? ' and ' : '') + `INDUSTRY_NAME like '%${data.industry}%'`;
            query.returnGeometry = true;
            query.where = sql;
            query.outFields = ['CORP_NAME', 'UNI_SC_ID'];
            const queryResult = await featureLayer.queryFeatures(query);
            setCurrentResult(
                queryResult.features.map((f) => ({ ...f.attributes, geometry: f.geometry }))
            );
        }
    };
    const handleReset = () => {
        reset({
            name: '',
            code: '',
            district: '',
            area: '',
            industry: ''
        });
        view?.graphics.removeAll();
        view?.popup.close();
        setCurrentResult(null);
        setArea(undefined);
    };
    const handleRowClick = async (item: QueryResultAttribute) => {
        if (view && item.UNI_SC_ID) {
            view.graphics.removeAll();
            const [Graphic] = await (loadModules(['esri/Graphic']) as Promise<LocationEsriModels>);
            const body = {
                username: sspConfig.THIRD_API.username,
                password: sspConfig.THIRD_API.password,
                reg_no: item.UNI_SC_ID as string,
                data_type: '主体基本信息'
            };
            const bodyYear = {
                username: 'test',
                password: 'test',
                reg_no: item.UNI_SC_ID as string,
                data_type: '年报'
            };
            const result = await runInfo(body);
            const yearResult = await runInfo(bodyYear);

            if (result.msg.code === '0') {
                const data = result.data as ThirdResultData;
                const yearData = yearResult.data as ThirdResultData[];
                const tab1 = `<div class="panel" id="one-panel">${Object.keys(result.data)
                    .map(
                        (item) =>
                            `<div><span class="name">${item}：</span><span class="value">${data[item]}</span></div>`
                    )
                    .join('')}</div>`;
                const tab2 = `<div class="panel" id="two-panel">
                                <table cellspacing="0">
                                    <thead>
                                        <tr>
                                            ${Object.keys(yearData[0])
                                                .map((key) => `<th>${key}</th>`)
                                                .join('')}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${yearData
                                            .map(
                                                (d) =>
                                                    `<tr> ${Object.keys(d)
                                                        .map((key) => `<td>${d[key]}</td>`)
                                                        .join('')}</tr>`
                                            )
                                            .join('')}
                                    </tbody>
                                </table>
                            </div>`;
                view.popup.open({
                    title: item.CORP_NAME as string,
                    content: `<div class="custom-popup-content">
                                <div class="panels">${tab1}${tab2}</div>
                            </div>`,
                    location: (item.geometry as unknown) as __esri.Geometry
                });
                view.popup.watch('visible', (state) => {
                    if (state === false) {
                        view.graphics.removeAll();
                    }
                });
            }
            const symbol = {
                type: 'picture-marker',
                url: locate_default_icon,
                height: '34px',
                width: '28px'
            } as __esri.SymbolProperties;
            const graphic = new Graphic({
                geometry: item.geometry as __esri.GeometryProperties,
                symbol
            });
            view.graphics.add(graphic);
            view.goTo(item.geometry, { duration: 400 });
        } else {
            console.error('统一社会信用代码未找到');
        }
    };
    const columns: EasyTableColumn<QueryResultAttribute>[] = [
        {
            name: '企业名称',
            key: 'CORP_NAME'
        },
        {
            name: '社会信用代码',
            key: 'UNI_SC_ID'
        }
    ];
    return (
        <div className="enterprise-search-container">
            <div className="show-btn">
                <Button className="button advanced" onClick={() => setOpen(true)}>
                    <img src={advanced_search_img} alt="高级搜索" />
                </Button>
            </div>
            <div className="content" style={{ display: open ? 'block' : 'none' }}>
                <div className="enterprise-search-params">
                    <div className="esri-blue-title">
                        <span>企业搜索</span>
                        <img
                            className="close-icon"
                            src={close_icon}
                            alt=""
                            onClick={() => setOpen(false)}
                        />
                    </div>
                    <div className="content">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <CustomInput
                                label="企业名称"
                                labelWidth={110}
                                width={355}
                                colon={false}
                            >
                                <InputBase inputRef={register({})} name="name" />
                            </CustomInput>
                            <CustomInput
                                label="信用代码"
                                labelWidth={110}
                                width={355}
                                colon={false}
                            >
                                <InputBase inputRef={register({})} name="code" />
                            </CustomInput>
                            <CustomInput
                                label="所属管区"
                                labelWidth={110}
                                width={355}
                                colon={false}
                            >
                                <InputBase inputRef={register({})} name="district" />
                            </CustomInput>
                            <CustomInput
                                label="所属区域"
                                labelWidth={110}
                                width={355}
                                colon={false}
                            >
                                <DictSelect
                                    onChange={(value) => setArea(value)}
                                    value={area}
                                    categoryName="行政区划"
                                    defaultValue="选择区域"
                                    defaultCategory="320500"
                                />
                            </CustomInput>
                            <CustomInput
                                label="所属行业"
                                labelWidth={110}
                                width={355}
                                colon={false}
                            >
                                <InputBase inputRef={register({})} name="industry" />
                            </CustomInput>
                            <div className="buttons">
                                <Button className="blue-border-button" onClick={handleReset}>
                                    重置
                                </Button>
                                <Button className="blue-border-button" type="submit">
                                    查询
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
                {currentResult && (
                    <div className="enterprise-search-result">
                        <QueryResultTotalCount total={currentResult.length} />
                        <div className="content">
                            <EasyTable
                                columns={columns}
                                data={currentResult.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)}
                                onRowClick={handleRowClick}
                                className="query-result-table"
                                pagination={{
                                    page: page,
                                    count: Math.ceil(currentResult.length / PAGE_SIZE),
                                    onChange: (index) => setPage(index)
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const QueryResultTotalCount = (props: { total: number }) => {
    return (
        <div className="query-total-count">
            <span>查询结果列表</span>
            <span>{`共${props.total}条结果`}</span>
        </div>
    );
};

export default EnterpriseSearch;
