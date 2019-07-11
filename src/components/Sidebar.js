import React from "react";
import { slide as Menu } from "react-burger-menu";
import { Link } from 'react-router-dom';

export default props => {
  return (
    // Pass on our props
    <Menu >
       <img  width="100%" height="80px"src={require('../images/dblogo.png')}/>   

       <hr/>
       <Link to={`/analiticaDemografia`}><i className="fas fa-chart-bar"></i>  Demografía</Link>
       <hr/>

       <Link to={`/analiticaActividad`}><i className="fas fa-chart-pie"></i>  Actividad</Link>
       <hr/>

       <Link to={`/analiticaUso`}><i className="fas fa-mobile-alt"></i>  Entorno de uso</Link>
       <hr/>

       <Link to={`/retencionUsuarios`}><i className="fas fa-magnet"></i>  Retención </Link>
       <hr/>

    </Menu>
  );
};
