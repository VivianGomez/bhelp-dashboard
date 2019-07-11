import React, { Component } from 'react';
import PP from 'papaparse';
import {HorizontalBar} from 'react-chartjs-2';
import '../App.css';

class GraficaSOs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataFile:[],
            sos: this.props.sos,
            porcentajesSO: this.props.porcentajesSO
        };
        this.getData = this.getData.bind(this);
	}

	componentWillReceiveProps(nextProps) {
     
		this.setState(
		  {
			dataFile:[],
						sos:nextProps.sos,
            porcentajesSO:nextProps.porcentajesSO
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
		console.log("DDD  ", datos)
		var pDispositivos=[];
    var pPorcentajes=[];

		for (let index = 0; index < datos.length; index++) {
		  if( index > 166 && index < 175){
            pDispositivos.push(datos[index][0]); 
            pPorcentajes.push(parseInt(datos[index][1]));
		  }
		}
	  
		this.setState({
			sos:pDispositivos,
      porcentajesSO:pPorcentajes
		})
	  }

  render() {

    const data = {
        labels: this.state.sos,
        datasets: [
          {
            label: 'Sistema operativo (%)',
            backgroundColor: 'rgba(52,95,241,0.2)',
            borderColor: 'rgba(52,95,241,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(52,95,241,0.6)',
            hoverBorderColor: 'rgba(52,95,241,1)',
            data: this.state.porcentajesSO
          }
        ]
      };

    return (
       <div>
        <h2>Sistemas operativos</h2>
            <HorizontalBar data={data} />
        </div>
    );
  }
}

export default GraficaSOs;
