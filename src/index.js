import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import "./index.css";
import SideBar from "./components/Sidebar";
import App from './App';
import * as serviceWorker from './serviceWorker';
import AnaliticaActividad from './components/AnaliticaActividad';
import AnaliticaDemografia from './components/AnaliticaDemografia';
import AnaliticaUso from './components/AnaliticaUso';
import AnaliticaRetencion from './components/AnaliticaRetencion';

ReactDOM.render(
  <Router>
      <div>

        <SideBar  outerContainerId={"App"} />
        <Route exact path='/' component={App} />
        <Route path='/analiticaDemografia' component={AnaliticaDemografia} />
        <Route path='/analiticaActividad' component={AnaliticaActividad} />
        <Route path='/analiticaUso' component={AnaliticaUso} />
        <Route path='/retencionUsuarios' component={AnaliticaRetencion} />
      </div>
  </Router>,
  document.getElementById('root')
);

serviceWorker.unregister();


