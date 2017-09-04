import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
import App from './App';
import Result from './Result'
import registerSw from './ServiceWorker'
import { BrowserRouter as Router, Route } from 'react-router-dom'


ReactDOM.render(
<App />,document.getElementById('root')
);
registerSw();