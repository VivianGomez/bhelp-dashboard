import React, { Component } from 'react';
import PP from 'papaparse';
import '../App.css';

class ListaPantallasInteraccion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataFile:[],
            pantallas: [],
        };
        this.getData = this.getData.bind(this);
	}

	componentWillReceiveProps(nextProps) {
     
		this.setState(
		  {
			dataFile:[],
			pantallas:nextProps.pantallas
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
        console.log("DATOS LISTA", datos);

		var pPantallas=[];
	  
		for (let index = 0; index < datos.length; index++) {
		  if( index > 73 && index < 80){
            pPantallas.push({nombre:datos[index][0], 
            porcentaje:datos[index][2].substring(0,4)+"%", tiempo:(""+(parseInt(datos[index][2])/60)).substring(0,4)+" mins"});
		  }
		}
	  
		this.setState({
			pantallas:pPantallas
		})
	  }

 


  render() {
    return (
      <div className="container">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">
              <b>Interacción por pantallas de la app</b>
            </h3>
          </div>
          <div className="panel-body">
            <table className="table table-stripe">
              <thead>
                <tr>
                  <th align="center">Pantalla</th>
                  <th align="center">% Participación</th>
                  <th align="center">Tiempo promedio</th>
                </tr>
              </thead>
              <tbody>
                {this.state.pantallas.map(pantalla =>
                  <tr key={pantalla.nombre}>
                    <td>{pantalla.nombre}</td>
                    <td align="center">{pantalla.porcentaje}</td>
                    <td align="center">{pantalla.tiempo}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default ListaPantallasInteraccion;
