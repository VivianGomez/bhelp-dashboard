import React, { Component } from 'react';
import '../App.css';
import { Button } from '@progress/kendo-react-buttons';
import PP from 'papaparse';
import GraficaRetencion from './GraficaRetencion';

    
class AnaliticaRetencion extends Component {
    constructor(props) {
        super(props);
        
        this.appContainer = React.createRef();
        this.handleChangeFile = this.handleChangeFile.bind(this);
    
        this.unsubscribe = null;
        this.state = { 
          dataFile:[],
          chartData:{
            labels:[],
            datasets:[
              {
                label:"",
                data:[],
                backgroundColor:[],
              }
            ]
            
          },
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
        var pFechas=[];
        var pUsersSemana=[];
      
              for (let index = 0; index < datos.length; index++) {
                if( index > 138 && index < 145){
                  pFechas.push(datos[index]["# ----------------------------------------"]); 
                  pUsersSemana.push(parseInt(datos[index]["__parsed_extra"][0]));
                }
        }   
    
        let charDataCopy = this.state.chartData
        charDataCopy.datasets[0].data = pFechas
        charDataCopy.datasets[0].backgroundColor = ['#d0f49c','#cd9cf4','#42a1ee','#66f1e6','#66f1a1','#78b9ee'];
        charDataCopy.labels = pUsersSemana
        
        this.setState(
          {
            chartData:charDataCopy
          }
        );
      }  
    
      render() {
        return (
            <div>
             <div className="bg-c-blue shadow text-light" >
                <br />
                <h1 className="text-center"><b>BHelp</b></h1>
                <h5 className="text-center raleway">          
                      Dashboard: Retención de usuarios               
                  <br />
                  <br />
                  <br />
                </h5>
              </div>
              <div className="container container-fluid mb-5">
              <div className="row" ref={(el) => this.appContainer = el}>
                    <div className="container">
                      <div className="row">
                        <div className="col-12">
                        <br/>
                        <br/>
                        <GraficaRetencion charData={this.state.charData} legendPosition="bottom"/>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
          </div>
        );
      }
    }    

export default AnaliticaRetencion;
