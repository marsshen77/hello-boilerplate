import './index.less';

import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Header from '@/components/Header';
const Cloud = React.lazy(() => import('@/pages/Cloud'));
const Business = React.lazy(() => import('@/pages/Business'));
const Visualization = React.lazy(() => import('@/pages/Visualization'));


const Container: React.FC = () => {
    return (
        <div className="root-container">
            <Header />
            <div className="content">
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/cloud" />
                    </Route>
                    <Route exact path="/cloud">
                        <Cloud />
                    </Route>
                    <Route exact path="/business">
                        <Business />
                    </Route>
                    <Route exact path="/visualization">
                        <Visualization />
                    </Route>
                </Switch>
            </div>
        </div>
    );
};

export default Container;
