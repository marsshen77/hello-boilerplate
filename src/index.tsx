import './global.less';

import ReactDOM from 'react-dom';
import React from 'react';
import App from './app';
import { setDefaultOptions } from 'esri-loader';

setDefaultOptions(sspConfig.ESRI_ROOT);

const render = () => {
    ReactDOM.render(<App />, document.getElementById('root'));
};

render();
