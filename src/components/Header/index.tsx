import './index.less';

import React from 'react';
import { menuConfig } from './menu';
import { useHistory, useLocation } from 'react-router-dom';
import { BASE_NAME } from '@/config';
import { Divider } from '@material-ui/core';

const Header: React.FC = () => {
    const history = useHistory();
    const location = useLocation();
    const path = location.pathname.split('/')[1];
    const menus = menuConfig.map((item, index) => {
        return (
            <>
                {index !== 0 && <Divider key={index} />}
                <span
                    className={path === item.path ? 'selected' : ''}
                    key={item.path}
                    onClick={() =>
                        item.newTab
                            ? window.open(BASE_NAME + item.path)
                            : history.push('/' + item.path)
                    }
                >
                    <span className="chinese">{item.title}</span>
                    <span className="english">{item.englishTitle}</span>
                </span>
            </>
        );
    });
    return (
        <div className="root-header">
            <div className="title-bg">
                <span>苏州市市场监管空间分析可视化系统</span>
            </div>
            <div className="menu-bar">{menus}</div>
        </div>
    );
};

export default Header;
