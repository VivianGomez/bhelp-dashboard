import React, { Component } from 'react';
import '../App.css';
import MultipleAxisChart from './MultipleAxisChart';
import { Button } from '@progress/kendo-react-buttons';
import PP from 'papaparse';
import LineLogChar from './LineLogChar';
import ListaPantallasInteraccion from './ListaPantallasInteraccion';
import 'react-hint/css/index.css'
import ReactHintFactory from 'react-hint';
const ReactHint = ReactHintFactory(React);


class AnaliticaUsuarios extends Component {
  constructor(props) {
    super(props);
    
    this.appContainer = React.createRef();
    this.handleChangeFile = this.handleChangeFile.bind(this);

    this.unsubscribe = null;
    this.state = { 
      dataFile:[],
      colores:[],
      datosActividad28d:[],
      datosActividad7d:[],
      datosActividad1d:[],
      datosTInteraccion:[],
      pantallas:[]
    };

  }

  
  /* */
  llenarColores(tam){
    let coloresRandom = [];

    var o = Math.round, r = Math.random, s = 240;
    for(let i=0; i < tam; i++){
      coloresRandom.push('rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')');
    }
    return coloresRandom;
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
  console.log("DATOS TI", datos);

  var pDatosActividad28d=[];
  var pDatosActividad7d=[];
  var pDatosActividad1d=[];
  var pDatosInteraccion=[];
  var pPantallas=[];

  for (let index = 0; index < datos.length; index++) {
    if( index > 3 && index < 34 && datos[index]["__parsed_extra"] !== undefined ){
      pDatosActividad28d.push({x:datos[index]["# ----------------------------------------"].slice(-2), y:parseInt(datos[index]["__parsed_extra"][0])});
      pDatosActividad7d.push({x:datos[index]["# ----------------------------------------"].slice(-2), y:parseInt(datos[index]["__parsed_extra"][1])});
      pDatosActividad1d.push({x:datos[index]["# ----------------------------------------"].slice(-2), y:parseInt(datos[index]["__parsed_extra"][2])});
    }
    else if( index > 40 && index < 71 && datos[index]["__parsed_extra"] !== undefined ){
      pDatosInteraccion.push({x:datos[index]["# ----------------------------------------"].slice(-2), y:(parseInt(datos[index]["__parsed_extra"][0])/60)});
    }
    else if( index > 72 && index < 79 && datos[index]["__parsed_extra"] !== undefined ){
      pPantallas.push({nombre:datos[index]["# ----------------------------------------"], 
      porcentaje:datos[index]["__parsed_extra"][0], tiempo:(""+(parseInt(datos[index]["__parsed_extra"][1])/60)).substring(0,4)+" mins"});
    }
  }

  this.setState({
    datosActividad28d:pDatosActividad28d,
    datosActividad7d:pDatosActividad7d,
    datosActividad1d:pDatosActividad1d,
    datosTInteraccion:pDatosInteraccion,
    pantallas: pPantallas
  })

}

  render() {
    return (
        <div>
         <div className="bg-c-blue shadow text-light" >
            <br />
            <h1 className="text-center"><b>BHelp</b></h1>
            <h5 className="text-center raleway">          
                   Dashboard: Actividad e Interacciones             
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
          <div className="row" ref={(el) => this.appContainer = el}>
                <div className="container">
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
                              data-rh="En esta gráfica se muestra el número acumulado de usuarios activos el ultimo mes, 
                              agrupados por temporalidades de actividad contínua de 1, 7 y 28 días. Si se ubica en un punto de la gráfica, 
                              esta le mostrará dichas agrupaciones para un determinado día del mes." 
                              data-rh-at="bop">
                              <i className="fas fa-question-circle text-primary"></i>
                          </p>
                      </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <br/>
                      <br/>
                      <MultipleAxisChart ejeY1={this.state.datosActividad28d} ejeY2={this.state.datosActividad7d} ejeY3={this.state.datosActividad1d}/>
                        <center>
                          <br/>
                          <br/>
                        </center>
                  </div>
                  </div>

                  <div className="row">
                    <div className="col-6">
                      <br/>
                      <br/>
                        <LineLogChar titulo={"Interacción diaria de los usuarios"} datos={this.state.datosTInteraccion}/>
                        <center>
                          <br/>
                          <br/>
                        </center>
                    </div>
                    <div className="col-6">
                      <br/>
                      <br/>
                        <center>
                        <ListaPantallasInteraccion  pantallas={this.state.pantallas}/>
                          <br/>
                          <br/>
                        </center>
                    </div>
                  </div>
              {/* <ListaUsuarios tutores={this.state.tutores}/> */}
              </div>

            </div>
          </div>
      </div>
    );
  }
}

export default AnaliticaUsuarios;
