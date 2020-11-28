import './index.less';
import React, { CSSProperties, ReactNode } from 'react';
import { Table, TableHead, TableCell, TableRow, TableBody } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { SortArrows } from '../SorterBar';

export interface EasyTableColumn<T> {
    style?: CSSProperties;
    /** 列名 */
    name?: string;
    /** 列对应data中的key值 */
    key?: keyof T;
    /** 列宽 */
    width?: string | number;
    /** 排序 */
    sort?: SortType;
    /** 排序 */
    onSortChange?: () => void;
    /** 渲染函数 */
    render?: (val: T) => string | ReactNode;
}
interface EasyTableProps<T> {
    /** 数据源 */
    data?: T[];
    /** 列配置信息 */
    columns: EasyTableColumn<T>[];
    /** 表格class属性 */
    className?: string;
    /** 分页信息，如果为空则不显示分页 */
    pagination?: EasyTablePagination | false;
    /** 行点击事件 */
    onRowClick?: (row: T) => void;
}
interface EasyTablePagination {
    /** 当前页数 */
    page: number;
    /** 总页数 */
    count: number;
    /** 页码变换回调函数 */
    onChange?: (index: number) => void;
}
type SortType = 'up' | 'down' | 'empty';
const EasyTable = <T,>(props: EasyTableProps<T>) => {
    const { columns, data, className, pagination = false, onRowClick } = props;
    const getTableHead = () => {
        return columns.map((column, index) => (
            <TableCell
                className={column.sort ? 'sortable' : ''}
                key={(column.key as string) || column.name || index}
                style={{ width: column.width || 'auto' }}
            >
                <span
                    className={column.sort ? 'sortable' : ''}
                    onClick={() => {
                        column.sort && column.onSortChange && column.onSortChange();
                    }}
                >
                    <span>{column.name || column.key}</span>
                    {column.sort && <SortArrows sort={column.sort} />}
                </span>
            </TableCell>
        ));
    };
    const getTableBody = () => {
        if (!data || data.length === 0)
            return (
                <TableRow>
                    <TableCell colSpan={columns.length} className="table-body-no-data">
                        暂无数据
                    </TableCell>
                </TableRow>
            );
        return data.map((row, index) => (
            <TableRow key={index} onClick={() => onRowClick && onRowClick(row)}>
                {columns.map((column) => {
                    const value = column.key ? row[column.key] : '';
                    return (
                        <TableCell key={(column.key as string) || column.name || index} style={column.style}>
                            {column.render ? column.render(row) : value}
                        </TableCell>
                    );
                })}
            </TableRow>
        ));
    };
    return (
        <div>
            <div className="easy-table-container">
                <Table className={`easy-table ${className}`}>
                    <TableHead>
                        <TableRow>{getTableHead()}</TableRow>
                    </TableHead>
                    <TableBody>{getTableBody()}</TableBody>
                </Table>
            </div>
            {pagination && (
                <Pagination
                    page={pagination.page || 1}
                    classes={{ root: 'easy-table-pagination', ul: 'global-pagination-ul' }}
                    count={pagination.count}
                    variant="outlined"
                    shape="rounded"
                    onChange={(_, index) => pagination.onChange && pagination.onChange(index)}
                />
            )}
        </div>
    );
};

interface ActionCellProps {
    onEdit?: () => void;
    onDelete?: () => void;
}
export const ActionCell = (props: ActionCellProps) => {
    return (
        <span className="action-cell">
            {props.onEdit && <img className="edit-button" src="" alt="编辑" onClick={props.onEdit} />}
            {props.onDelete && <img className="delete-button" src="" alt="删除" onClick={props.onDelete} />}
        </span>
    );
};
export default EasyTable;
