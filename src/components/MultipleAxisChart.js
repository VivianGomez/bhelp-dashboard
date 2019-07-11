import React, { Component } from 'react';
import CanvasJSReact from '../assets/canvasjs.react';
import PP from 'papaparse';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
 
class MultipleAxisChart extends Component {	
		constructor(props) {
		super(props);
		this.toggleDataSeries = this.toggleDataSeries.bind(this);
		this.state = {
			dataFile:[],
			titulo:this.props.tituloGrafica,
			ejeY1:this.props.ejeY1,
			ejeY2:this.props.ejeY2,
			ejeY3:this.props.ejeY3
		}
		this.getData = this.getData.bind(this);
	}

	componentWillReceiveProps(nextProps) {
     
		this.setState(
		  {
			dataFile:[],
			titulo:nextProps.tituloGrafica,
			ejeY1:nextProps.ejeY1,
			ejeY2:nextProps.ejeY2,
			ejeY3:nextProps.ejeY3
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
		var pDatosActividad28d=[];
		var pDatosActividad7d=[];
		var pDatosActividad1d=[];
	  
		for (let index = 0; index < datos.length; index++) {
		  if( index > 4 && index < 35){
			pDatosActividad28d.push({x:datos[index][0].slice(-2), y:parseInt(datos[index][1])});
			pDatosActividad7d.push({x:datos[index][0].slice(-2), y:parseInt(datos[index][2])});
			pDatosActividad1d.push({x:datos[index][0].slice(-2), y:parseInt(datos[index][3])});
	  
		  }
		}
	  
		this.setState({
			ejeY1:pDatosActividad28d,
			ejeY2:pDatosActividad7d,
			ejeY3:pDatosActividad1d
		})
	  }


	toggleDataSeries(e){
		if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		}
		else{
			e.dataSeries.visible = true;
		}
		this.chart.render();
	}
	
	render() {
		const options = {
			theme: "light2",
			animationEnabled: true,
			title:{
				text: "Número de usuarios activos"
			},
			subtitles: [{
				text: "Agrupado por periodos de 28, 7 y 1 día(s)"
			}],
			axisX: {
				title: "Días del mes",
				maximum: 30

			},
			
			toolTip: {
				shared: true
			},
			legend: {
				cursor: "pointer",
				itemclick: this.toggleDataSeries
			},
			data: [{
				type: "spline",
				name: "28 días",
				showInLegend: true,
				dataPoints: this.state.ejeY1
			},
			{
				type: "spline",
				name: "7 días",
				showInLegend: true,
				dataPoints: this.state.ejeY2
			},
			{
				type: "spline",
				name: "1 día",
				showInLegend: true,
				dataPoints: this.state.ejeY3

			}]
		}
		
		
		return (
		  <div className="MultipleAxisChart">
			<CanvasJSChart options = {options} 
				 onRef={ref => this.chart = ref}
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
}

export default MultipleAxisChart;