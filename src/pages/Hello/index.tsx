import React from 'react';
import styles from './index.module.less';

interface IProps {
    data: string;
}
const Test: React.FC<IProps> = (props) => {
    return <div className={styles.container}>Hello {props.data} !</div>;
};

export default Test;
