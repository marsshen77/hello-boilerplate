import './index.less';

import React, { useRef, useState } from 'react';
import { Button, ClickAwayListener, MenuItem, Popper } from '@material-ui/core';
import { useRequest } from 'ahooks';
import { getMetaBaseList } from '@/api/resource';
import { MetaBaseModel } from '@/typings/resource';

interface DictSelectProps {
    /** 字典中类别名 */
    categoryName: string;
    /** 显示的当前值 */
    value?: MetaBaseModel;
    defaultValue?: string;
    /** 选择新值的回调 */
    onChange: (item: MetaBaseModel) => void;
}
/**
 * 多级选择，数据动态从数据字典中获取
 * @param props
 */
export const DictSelect = (props: DictSelectProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { data: result } = useRequest(() => getMetaBaseList(props.categoryName, ''));
    const [open, setOpen] = useState(false);
    const getMenuItems = () => {
        return result?.data.map((item) =>
            item.hasChild ? (
                <DictSelectItem key={item.code} {...item} {...props} handleClose={setOpen} />
            ) : (
                <MenuItem
                    className={item.code === props.value?.code ? 'selected' : ''}
                    key={item.code}
                    onClick={() => {
                        props.onChange(item);
                        setOpen(false);
                    }}
                >
                    {item.name}
                </MenuItem>
            )
        );
    };
    return (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <div ref={ref} className="dict-select-input">
                <Button onClick={() => setOpen(true)}>
                    {props.value?.name || props.defaultValue || '点击下拉选择'}
                </Button>
                <Popper
                    className="dict-select-popper"
                    open={open}
                    anchorEl={ref.current}
                    placement="bottom-start"
                >
                    {getMenuItems() || <div>loading</div>}
                </Popper>
            </div>
        </ClickAwayListener>
    );
};

interface DictSelectItemProps extends MetaBaseModel, DictSelectProps {
    handleClose: (state: boolean) => void;
}
export const DictSelectItem = (props: DictSelectItemProps) => {
    const ref = useRef<HTMLLIElement>(null);
    const [rootOpen, setRootOpen] = useState(false);
    const [basicOpen, setBasicOpen] = useState(false);
    const { data: result } = useRequest(() => getMetaBaseList(props.categoryName, props.code));
    const getMenuItems = () => {
        return result?.data.map((item) =>
            item.hasChild ? (
                <DictSelectItem key={item.code} {...props} {...item} />
            ) : (
                <MenuItem
                    key={item.code}
                    onClick={() => {
                        props.onChange(item);
                        props.handleClose(false);
                    }}
                    className={item.code === props.value?.code ? 'selected' : ''}
                >
                    {item.name}
                </MenuItem>
            )
        );
    };
    const open = rootOpen || basicOpen;
    return (
        <>
            <MenuItem
                className={props.code === props.value?.code ? 'selected' : ''}
                ref={ref}
                onMouseEnter={() => {
                    setRootOpen(true);
                }}
                onMouseLeave={() => setRootOpen(false)}
                onClick={() => {
                    props.onChange(props);
                    props.handleClose(false);
                }}
            >
                {props.name}
            </MenuItem>
            <Popper
                className="dict-select-popper"
                open={open}
                anchorEl={ref.current}
                placement="right-start"
                onMouseEnter={() => setBasicOpen(true)}
                onMouseLeave={() => setBasicOpen(false)}
            >
                {getMenuItems() || <div>loading</div>}
            </Popper>
        </>
    );
};
