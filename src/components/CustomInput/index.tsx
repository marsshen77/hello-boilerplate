import './index.less';
import React, { ReactNode } from 'react';

interface CustomInputProps {
    /** 标签 */
    label: string;
    /** 标签宽度 */
    labelWidth?: string | number;
    /** 组件总宽度 */
    width?: string | number;
    children: ReactNode[] | ReactNode;
    /** 是否添加冒号 */
    colon?: boolean;
    /** 是否必填项 */
    required?: boolean;
}
/**
 * 自定义输入框
 * @param props
 */
const CustomInput: React.FC<CustomInputProps> = (props) => {
    const { label, labelWidth: label_width = 'auto', width = '100%', colon = true, required = false } = props;
    return (
        <div className="custom-input-container" style={{ width }}>
            <div className="content">
                <span className={`custom-label ${required ? 'is-required' : ''}`} style={{ width: label_width, minWidth: label_width }}>
                    {label + (colon ? '：' : '')}
                </span>
                <span className="custom-input">{props.children instanceof Array ? props.children[0] : props.children}</span>
            </div>
            <div className="error-message">{props.children instanceof Array ? props.children[1] : ''}</div>
        </div>
    );
};

export default CustomInput;
