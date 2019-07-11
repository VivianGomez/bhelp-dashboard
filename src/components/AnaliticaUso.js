import React, { Component } from 'react';
import '../App.css';
import { Button } from '@progress/kendo-react-buttons';
import PP from 'papaparse';
import GraficaDispositivos from './GraficaDispositivos';
import GraficaSOs from './GraficaSOs';
import GraficaPaises from './GraficaPaises';
import 'react-hint/css/index.css'
import ReactHintFactory from 'react-hint';
const ReactHint = ReactHintFactory(React);

    
class AnaliticaUso extends Component {
    constructor(props) {
        super(props);
        
        this.appContainer = React.createRef();
        this.handleChangeFile = this.handleChangeFile.bind(this);
    
        this.unsubscribe = null;
        this.state = { 
          dataFile:[],
          dispositivos: [],
          porcentajesD: [],
          sos: [],
          porcentajesSO: [],
          paises: [],
		      sesiones: [],
          porcentajeP: [],
          datosPaises:[]
        };
      }

      //SE TIENE EN CUENTA QUE EL CSV QUE LLEGA DESDE FIREBASE ANALYTICS SEA DE LOS ULTIMOS 30 DÍAS
      handleChangeFile(event)
      {
          let file = event.target.files[0];
          PP.parse(file, {
              header: true,
              download: true,
              complete: (results) => {
                this.setState({dataFile:results.data});
                this.leerDatosCSV(this.state.dataFile);
              }
          });
    }
    
    cargarArchivoBase()
    {
        let file = 0;
        PP.parse(file, {
            header: true,
            download: true,
            complete: (results) => {
              this.setState({dataFile:results.data});
              this.leerDatosCSV(this.state.dataFile);
            }
        });
    }
    
    leerDatosCSV(datos){
      console.log("ESTOS SON", datos);
        var pDispositivos=[];
        var pPorcentajesD=[];
        var pSOs=[];
        var pPorcentajesSO=[];
        var pPaises=[];
		    var pSesiones=[];
        var pPorcentajesp=[];
        var pDatosPaises=[];
      
              for (let index = 0; index < datos.length; index++) {
                if( index > 151 && index < 164){
                  pDispositivos.push(datos[index]["# ----------------------------------------"]); 
                  pPorcentajesD.push(parseInt(datos[index]["__parsed_extra"][0]));
                }
                else if( index > 165 && index < 174){
                    pSOs.push(datos[index]["# ----------------------------------------"]); 
                    pPorcentajesSO.push(parseInt(datos[index]["__parsed_extra"][0]));
                }     
                else if( index > 147 && index < 150 && datos[index]["__parsed_extra"][1] !== undefined){
                  pPaises.push(datos[index]["# ----------------------------------------"]); 
                  pSesiones.push(parseInt(datos[index]["__parsed_extra"][0]));
                  pPorcentajesp.push(parseInt(datos[index]["__parsed_extra"][1]));
                  pDatosPaises.push({pais:datos[index]["# ----------------------------------------"],
                               sesiones:parseInt(datos[index]["__parsed_extra"][0]),
                               porcentaje:datos[index]["__parsed_extra"][1].substring(0,4)
                              })
                }   
    }
    this.setState({
      dispositivos:pDispositivos,
      porcentajesD:pPorcentajesD,
      sos:pSOs,
      porcentajesSO:pPorcentajesSO,
      paises: pPaises,
		  sesiones: pSesiones,
      porcentajeP: pPorcentajesp,
      datosPaises:pDatosPaises
  })
}
      
    
      render() {
        return (
            <div>
             <div className="bg-c-blue shadow text-light" >
                <br />
                <h1 className="text-center"><b>BHelp</b></h1>
                <h5 className="text-center raleway">          
                      Dashboard: Entorno de uso                           
                  <br />
                  <br />
                  <br />
                </h5>
              </div>
              <div className="container container-fluid mb-5">
              <div align="right">
              <br />
                  <div className="upload-btn-wrapper">
                  <Button  className="btn btn-primary mr-2 mb-2"><i className="far fa-edit"></i>&nbsp;Importar datos</Button>
                   <input type="file" 
                    name="myfile" 
                    type="file" 
                    id="fileinput"
                    className="input-file "
                    accept=".csv"
                    value={this.state.file}
                    onChange={ this.handleChangeFile }               
                   />
                  </div>
              </div>
              <div className="row">
                    <div className="col-4">
                      <ReactHint autoPosition events delay={{show: 100, hide: 1000}} />
                      <ReactHint persist
                        attribute="data-custom"
                        className="custom-hint"
                        events={{click: true}}
                        onRenderContent={this.onRenderContent}
                        ref={(ref) => this.instance = ref} />
                          <p   
                              data-rh="En esta sección encuentras la información de sistemas operativos y dispositivos en los cuales los usuarios 
                              están usando BHelp, además de los países donde estan ubicados. Recuerda que esta información es util para conocer tus segmentos 
                              de mercado" 
                              data-rh-at="bop">
                              <i className="fas fa-question-circle text-primary"></i>
                          </p>
                      </div>
                  </div>
              <div className="row" ref={(el) => this.appContainer = el}>
                    <div className="container">
                      <div className="row">
                        <div className="col-6">
                          <br/>
                          <br/>
                          <GraficaDispositivos dispositivos={this.state.dispositivos} porcentajesD={this.state.porcentajesD}/>
                            <center>
                              <br/>
                              <br/>
                            </center>
                        </div>
                        <div className="col-6">
                          <br/>
                          <br/>
                          <GraficaSOs sos={this.state.sos} porcentajesSO={this.state.porcentajesSO}/>
                            <center>
                              <br/>
                              <br/>
                            </center>
                        </div>
                      </div>
                      <div className="row">
                          <br/>
                          <br/>
                          <GraficaPaises paises={this.state.paises} sesiones={this.state.sesiones} porcentajesP={this.state.porcentajeP} datosPaises={this.state.datosPaises}/>
                     </div>
                  </div>
                </div>
              </div>
          </div>
        );
      }
    }    

export default AnaliticaUso;
