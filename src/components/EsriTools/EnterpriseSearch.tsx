import './index.less';
import close_icon from './images/guanbi@2x.png';

import React from 'react';
import CustomInput from '../CustomInput';
import { EsriMap, EsriView } from '@/typings/esri';
import { Button, InputBase } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import EasyTable from '../EasyTable';
import { loadModules } from 'esri-loader';

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
    typeof import('esri/tasks/GeometryService'),
    typeof import('esri/layers/FeatureLayer'),
    typeof import('esri/tasks/support/Query'),
    typeof import('esri/layers/GraphicsLayer'),
    typeof import('esri/Graphic')
];

interface EnterpriseSearchProps {
    map?: EsriMap;
    view?: EsriView;
    prefix: string;
}
const EnterpriseSearch = (props: EnterpriseSearchProps) => {
    const { map, view, prefix } = props;
    const { handleSubmit, errors, control, register, reset } = useForm<EnterpriseFormType>({
        defaultValues: { name: '', code: '', district: '', area: '', industry: '' }
    });
    const handleClose = () => {};
    const onSubmit = async (data: EnterpriseFormType) => {
        if (map && view) {
            const [
                GeometryService,
                FeatureLayer,
                Query,
                GraphicsLayer,
                Graphic
            ] = await (loadModules([
                'esri/tasks/GeometryService',
                'esri/layers/FeatureLayer',
                'esri/tasks/support/Query',
                'esri/layers/GraphicsLayer',
                'esri/Graphic'
            ]) as Promise<SearchEsriModels>);
            const featureLayer = new FeatureLayer({ url: `${prefix}/FRKDZ/MapServer/0` });
            const query = new Query();
            let sql = '';
            if (data.name) sql += `CORP_NAME like '%${data.name}%'`;
            if (data.code) sql += (sql ? ' and ' : '') + `UNI_SC_ID like '%${data.code}%'`;
            if (data.district) sql += (sql ? ' and ' : '') + `ORGAN_NAME like '%${data.code}%'`;
            if (data.area) sql += (sql ? ' and ' : '') + `AREA_CODE like '%${data.code}%'`;
            if (data.industry) sql += (sql ? ' and ' : '') + `INDUSTRY_NAME like '%${data.code}%'`;
            query.returnGeometry = true;
            query.where = sql;
            query.outFields = ['CORP_NAME', 'UNI_SC_ID'];
            const queryResult = await featureLayer.queryFeatures(query);
            console.log(queryResult);
        }
    };
    return (
        <div className="enterprise-search-container">
            <div className="enterprise-search-params">
                <div className="esri-blue-title">
                    <span>企业搜索</span>
                    <img className="close-icon" src={close_icon} alt="" onClick={handleClose} />
                </div>
                <div className="content">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <CustomInput label="企业名称" labelWidth={100} width={355} colon={false}>
                            <InputBase inputRef={register({})} name="name" />
                        </CustomInput>
                        <CustomInput label="信用代码" labelWidth={100} width={355} colon={false}>
                            <InputBase inputRef={register({})} name="code" />
                        </CustomInput>
                        <CustomInput label="所属管区" labelWidth={100} width={355} colon={false}>
                            <InputBase inputRef={register({})} name="district" />
                        </CustomInput>
                        <CustomInput label="所属区域" labelWidth={100} width={355} colon={false}>
                            <InputBase inputRef={register({})} name="area" />
                        </CustomInput>
                        <CustomInput label="所属行业" labelWidth={100} width={355} colon={false}>
                            <InputBase inputRef={register({})} name="industry" />
                        </CustomInput>
                        <div className="buttons">
                            <Button
                                className="blue-border-button"
                                onClick={() =>
                                    reset({
                                        name: '',
                                        code: '',
                                        district: '',
                                        area: '',
                                        industry: ''
                                    })
                                }
                            >
                                重置
                            </Button>
                            <Button className="blue-border-button" type="submit">
                                查询
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
            {/* <div
                className="enterprise-search-result"
                style={{ display: columns.length > 0 ? 'block' : 'none' }}
            >
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
            </div> */}
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
