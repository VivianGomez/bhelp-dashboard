import React, { Component } from 'react';
import PP from 'papaparse';
import {Pie} from 'react-chartjs-2';
import '../App.css';

class GraficaPaises extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataFile:[],
            paises: this.props.paises,
						sesiones: this.props.sesiones,
						porcentajesP: this.props.porcentajesP,
						datosPaises: this.props.datosPaises
        };
        this.getData = this.getData.bind(this);
	}

	componentWillReceiveProps(nextProps) {
     
		this.setState(
		  {
			dataFile:[],
            paises:nextProps.paises,
            sesiones:nextProps.sesiones,
						porcentajesP:nextProps.porcentajesP,
						datosPaises:nextProps.datosPaises
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
		var pPaises=[];
		var pSesiones=[];
		var pPorcentajes=[];
		var pDatos=[];

		for (let index = 0; index < datos.length; index++) {
		  if( index > 148 && index < 151){
						pPaises.push(datos[index][0]); 
						pSesiones.push(parseInt(datos[index][1]));
						pPorcentajes.push(parseInt(datos[index][2]));
						pDatos.push({pais:datos[index][0],sesiones:parseInt(datos[index][1]),porcentaje:datos[index][2].substring(0,4)})
		  }
		}
	  
		this.setState({
            paises:pPaises,
						sesiones:pSesiones,
						porcentajesP:pPorcentajes,
						datosPaises:pDatos
		})
	}

  render() {

    const data = {
			labels: this.state.paises,
			datasets: [{
				data: this.state.sesiones,
				backgroundColor: [
				'#FFCE56',
				'#FF6384'
				],
				hoverBackgroundColor: [
				'#FFCE56',
+				'#FF6384'
				]
			}]
		};

    return (
       <div className="container">
				<div className="row">
					<h3>Ubicación (por país) de los usuarios</h3>
				</div>
				 <div className="row">
					 <div className="col-4">
					  <br/>
				   	<br/>
            <Pie data={data} />
					 </div>
					 <div className="col-8">
						<br/>
						<br/>
						<br/>
						<div className="panel panel-default">
								<div className="panel-heading">
								</div>
								<div className="panel-body">
									<table className="table table-stripe">
										<thead>
											<tr>
												<th>Código país</th>
												<th># Sesiones</th>
												<th>% Total</th>
											</tr>
										</thead>
										<tbody>
											{this.state.datosPaises.map(pais =>
												<tr key={pais.pais}>
													<td>{pais.pais}</td>
													<td >{pais.sesiones}</td>
													<td>{pais.porcentaje}</td>
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

export default GraficaPaises;
