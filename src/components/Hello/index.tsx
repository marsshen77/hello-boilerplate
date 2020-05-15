import React from 'react';
import './index.less';

interface IProps {
    data: string;
}
const Test: React.FC<IProps> = (props) => {
    return <div className="hello-container">Hello {props.data} !</div>;
};

export default Test;
