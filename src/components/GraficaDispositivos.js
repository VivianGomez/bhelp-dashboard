import React, { Component } from 'react';
import PP from 'papaparse';
import {HorizontalBar} from 'react-chartjs-2';
import '../App.css';

class ListaDispositivos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataFile:[],
            dispositivos: this.props.dispositivos,
            porcentajesD: this.props.porcentajesD
        };
        this.getData = this.getData.bind(this);
	}

	componentWillReceiveProps(nextProps) {
     
		this.setState(
		  {
			dataFile:[],
      dispositivos:nextProps.dispositivos,
      porcentajesD:nextProps.porcentajesD
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
		var pDispositivos=[];
    var pPorcentajes=[];

		for (let index = 0; index < datos.length; index++) {
		  if( index > 152 && index < 165){
            pDispositivos.push(datos[index][0]); 
            pPorcentajes.push(parseInt(datos[index][1]));
		  }
		}
	  
		this.setState({
            dispositivos:pDispositivos,
            porcentajesD:pPorcentajes
		})
	  }

  render() {

    const data = {
        labels: this.state.dispositivos,
        datasets: [
          {
            label: 'Modelo (%)',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.6)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: this.state.porcentajesD 
          }
        ]
      };

    return (
       <div>
        <h2>Dispositivos</h2>
            <HorizontalBar data={data} />
        </div>
    );
  }
}

export default ListaDispositivos;
