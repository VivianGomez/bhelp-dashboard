import React, {Component} from 'react';
import {Bar, Line, Pie, Polar} from 'react-chartjs-2';
import PP from 'papaparse';
import 'react-hint/css/index.css'
import ReactHintFactory from 'react-hint';
const ReactHint = ReactHintFactory(React);


class GraficaRetencion extends Component{
  constructor(props){
    super(props);
    this.handleChangeMark = this.handleChangeMark.bind(this);
    this.graficarEn = this.graficarEn.bind(this);
    this.state = {
      chartData:this.props.chartData,
      tipo:"barras",
      fechas:this.props.fechas,
      nUsuariosSemanas:this.props.nUsuariosSemanas,
      datos: []
    };
    this.getData = this.getData.bind(this);
  }

  componentWillReceiveProps(nextProps) {
     
    this.setState(
      {
        chartData:nextProps.chartData,
        fechas:nextProps.fechas,
        nUsuariosSemanas:nextProps.nUsuariosSemanas,
        datos: []
      },
    );
}

componentWillMount() {
  this.getCsvData();
}

fetchCsv() {
  return fetch('/data/datos.csv').then(function (response) {
    let reader = response.body.getReader();
    let decoder = new TextDecoder('utf-8');

    return reader.read().then(function (result) {
      return decoder.decode(result.value);
    });
  });
}

getData(result) {
  this.setState({dataFile: result.data});
  this.leerDatosCSV(this.state.dataFile);
}

async getCsvData() {
  let  csvData= await this.fetchCsv();

  PP.parse(csvData, {
    complete: this.getData
  });
}

leerDatosCSV(datos){
  var pFechas=[];
  var pnUsuariosSemanas=[];
  var pDatos=[];


  for (let index = 0; index < datos.length; index++) {
    if( index > 139 && index < 146){
          pFechas.push(datos[index][0]); 
          pnUsuariosSemanas.push(parseInt(datos[index][1]));  
          pDatos.push({fecha:datos[index][0],
                      s1:parseInt(datos[index][1]),
                      s2:parseInt(datos[index][2]),
                      s3:parseInt(datos[index][3]),
                      s4:parseInt(datos[index][4]),
                      s5:parseInt(datos[index][5])})
    }
  }
  
  this.setState({
          fechas:pFechas,
          nUsuariosSemanas:pnUsuariosSemanas,
          datos:pDatos
  })
}


  static defaultProps = {
    displayTitle:true,
    displayLegend: true,
    legendPosition:'right'
  }

  handleChangeMark(event) {
    let spec = event.target.value;    
    this.setState({ tipo: spec});
}

  graficarEn(tipoGrafica){

    const data = {
      labels:this.state.fechas,
      datasets:[
        {
          label:"",
          data:this.state.nUsuariosSemanas,
          backgroundColor:[
          '#d0f49c',
          '#cd9cf4',
          '#42a1ee',
          '#66f1e6',
          '#66f1a1',
          '#78b9ee']
        }
      ]
      
    };


    if(tipoGrafica === "area"){
        return (
            <Line
                data={data}
                fill={false}
                lineTension={0.3}
                options={{
                    title:{
                    display:this.props.displayTitle,
                    text:'Retención de usuarios',
                    fontSize:25
                    },
                    legend:{
                    display:this.props.displayLegend,
                    position:this.props.legendPosition
                    },
                    reverse:false
                }}
                redraw={false}
                />
        );
      }
      else if(tipoGrafica === "pie"){
        return (
            <Pie
            data={data}
            options={{
                    title:{
                    display:this.props.displayTitle,
                    text:'Retención de usuarios',
                    fontSize:25
                    },
                    legend:{
                    display:this.props.displayLegend,
                    position:this.props.legendPosition
                    }
                }}
            />
        );
      }
      else if(tipoGrafica === "polar"){
        return (
            <Polar
            data={data}
            options={{
                    title:{
                    display:this.props.displayTitle,
                    text:'Retención de usuarios',
                    fontSize:25
                    },
                    legend:{
                    display:this.props.displayLegend,
                    position:this.props.legendPosition
                    }
                }}
            />
        );
      }
      else{
        return (
            <Bar
            data={data}
            options={{
                    title:{
                    display:this.props.displayTitle,
                    text:'Retención de usuarios',
                    fontSize:25
                    },
                    legend:{
                    display:this.props.displayLegend,
                    position:this.props.legendPosition,
                    },
                    scales: {
                      yAxes: [{
                          ticks: {
                              beginAtZero: true,
                              min: 0
                          }
                      }]
                  }
                }}
            />
        );
      }
      
  }

  cambiarNegativo(num){
    if(num <0){
      return "-";
    }
    else{
      return num;
    }
  }

  mostrarPorcentaje(anterior, actual){
    if(anterior < 0 || actual < 0){
      return "";
    }
    else{
      var divi = ""+(actual/anterior)*100;
      if(divi !== "NaN" ){
        return (divi).substring(0,4)+"%";
      }
      else{
        return "";
      }
    }
  }

  

  render(){
    return (
      <div className="container">
        <div className="row">
         <div className="col-4">
                <ReactHint persist
                  attribute="data-custom"
                  className="custom-hint"
                  events={{click: true}}
                  onRenderContent={this.onRenderContent}
                  ref={(ref) => this.instance = ref} />
                  
                    <p   
                        data-rh="Para cada periodo se muestra el número de usuarios que se unieron a BHelp" 
                        data-rh-at="bot">
                        <i className="fas fa-question-circle text-primary"></i>
                    </p>
          </div> 
        </div>
        <div className="row">
         <div className="col-12">
            <div className="form-group">
                <label htmlFor="tipoGrafica">
                <h5><b>Gráfico:</b></h5>
                </label>
                <select
                className="form-control"
                value={this.state.tipo}
                onChange={this.handleChangeMark} >
                <option value="barras">Barras</option>
                <option value="pie">Pie</option>
                <option value="polar">Polar</option>
                <option value="area">Área</option>
                
                </select>
            </div>
                {this.graficarEn(this.state.tipo)}
                <br/>
                <br/>
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
                        data-rh="Se muestra en detalle, para cada periodo (indicado en filas), del 100%, semana a semana cuántos usuarios volvieron a usar la app" 
                        data-rh-at="bop">
                        <i className="fas fa-question-circle text-primary"></i>
                    </p>
                </div>
             </div>
             <div className="row">
              <div className="col-12">
                <div className="panel panel-default">
                          <div className="panel-heading">
                          </div>
                          <div className="panel-body">
                            <table className="table table-stripe">
                              <thead>
                                <tr>
                                  <th>Periodo</th>
                                  <th>Semana 1</th>
                                  <th>Semana 2</th>
                                  <th>Semana 3</th>
                                  <th>Semana 4</th>
                                  <th>Semana 5</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.datos.map(dato =>
                                  <tr key={dato.fecha}>
                                    <td>{dato.fecha}</td>
                                    <td>{this.cambiarNegativo(dato.s1)+" - 100%"}</td>
                                    <td>{this.cambiarNegativo(dato.s2)+" - "+this.mostrarPorcentaje(dato.s1, dato.s2)}</td>
                                    <td>{this.cambiarNegativo(dato.s3)+" - "+this.mostrarPorcentaje(dato.s1, dato.s3)}</td>
                                    <td>{this.cambiarNegativo(dato.s4)+" - "+this.mostrarPorcentaje(dato.s1, dato.s4)}</td>
                                    <td>{this.cambiarNegativo(dato.s5)+" - "+this.mostrarPorcentaje(dato.s1, dato.s5)}</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                   </div>
              </div>
            </div>
        </div>
    );
  }
}

export default GraficaRetencion;
