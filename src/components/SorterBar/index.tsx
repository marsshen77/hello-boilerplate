import './index.less';
import React from 'react';

export type SortTypeValue = 'up' | 'down' | 'empty';
export type StateValue = {
    value: string;
    sort: SortTypeValue;
};
type TypeItem = { name: string; value: string; sort: SortTypeValue };
interface SorterBarProps {
    items: TypeItem[];
    defaultValue?: StateValue;
    onChange?: (val: string) => void;
}
/**
 * 排序条
 * @param
 */
const SorterBar = (props: SorterBarProps) => {
    const { items, onChange } = props;
    const handleClick = (item: TypeItem) => {
        onChange && onChange(item.value);
    };
    const sorterItems = items.map((item) => {
        return (
            <span className={`item ${item.sort !== 'empty' ? 'selected' : ''}`} key={item.value} onClick={() => handleClick(item)}>
                <span>{item.name}</span>
                <SortArrows sort={item.sort} />
            </span>
        );
    });
    return <div className="sorter-bar">{sorterItems}</div>;
};

export const SortArrows = (props: { sort: SortTypeValue; active?: boolean }) => {
    const { active = true, sort } = props;
    return (
        <span className={`sort-arrows ${active ? '' : 'hidden'}`}>
            <span className={`top ${sort === 'up' ? 'active' : ''}`}></span>
            <span className={`down ${sort === 'down' ? 'active' : ''}`}></span>
        </span>
    );
};
export default SorterBar;
