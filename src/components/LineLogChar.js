import React, { Component } from 'react';
import CanvasJSReact from '../assets/canvasjs.react';
import PP from 'papaparse';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

 
class LineLogChar extends Component {
    constructor(props) {
		super(props);
		this.state = {
			dataFile:[],
			titulo:this.props.titulo,
			datos:this.props.datos
		}
		this.getData = this.getData.bind(this);
	}

	componentWillReceiveProps(nextProps) {
     
		this.setState(
		  {
			dataFile:[],
			titulo:nextProps.titulo,
			datos:nextProps.datos
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
      
		var pDatos=[];
	  
		for (let index = 0; index < datos.length; index++) {
		  if( index > 41 && index < 72){
			pDatos.push({x:datos[index][0].slice(-2), y:(parseInt(datos[index][1])/60)});
		  }
		}
	  
		this.setState({
			datos:pDatos
		})
	  }

  	render() {
		const options = {
			animationEnabled: true,
			theme: "light2",
			title: {
                text: this.state.titulo
            },
            axisY: {
				title: "Tiempo (minutos)",
			},
            axisX: {
				title: "Días del mes",
				maximum: 30
			},
			
			data: [{
				type: "spline",
				showInLegend: true,
				legendText: "Tiempo promedio de interacción",
				dataPoints: this.state.datos
			}]
		}
		return (
		  <div className="ChartWithLogarithmicAxis">
			<CanvasJSChart options = {options} />
		  </div>
		);
	}
}
 
export default LineLogChar;