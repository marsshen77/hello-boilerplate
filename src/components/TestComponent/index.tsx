import React from 'react';

interface IProps {
    data: string;
}
const Test: React.FC<IProps> = (props) => {
    return <div>{props.data}</div>;
};

export default Test;
