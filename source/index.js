import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
import App from './App';
import Search from './Search';
import Result from './Result'
import Main from './Main'
import registerSw from './ServiceWorker'
import { HashRouter as Router, Route} from 'react-router-dom'


ReactDOM.render((
    <Router>
        <div>
        <Route path ="/:searchString?" component={App} />
       {/*<Route exact path ="/" component={App} />*/}
        {/*<Route path ="/:searchString" component={App} />*/}
        </div>
    </Router>),
    document.getElementById('root'))
registerSw();


