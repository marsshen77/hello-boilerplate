import { hot } from 'react-hot-loader/root';
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Container from './components/Container';
import { BASE_NAME } from '@/config';

const App: React.FC = () => {
    return (
        <Suspense
            fallback={
                <div className="lds-ring">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            }
        >
            <Router basename={BASE_NAME}>
                <Switch>
                    <Route path="/">
                        <Container />
                    </Route>
                </Switch>
            </Router>
        </Suspense>
    );
};
export default hot(App);
