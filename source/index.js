import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import registerSw from './ServiceWorker'
import { HashRouter as Router, Route} from 'react-router-dom'


ReactDOM.render((
    <Router>
        <div>
        <Route path ="/:searchString?" component={App} />
        </div>
    </Router>),
    document.getElementById('root'))
registerSw();


