import React, {Component} from 'react';
import {Bar, Line, Pie, Polar} from 'react-chartjs-2';


class Grafica extends Component{
  constructor(props){
    super(props);
    this.handleChangeMark = this.handleChangeMark.bind(this);
    this.graficarEn = this.graficarEn.bind(this);
    this.state = {
      chartData:this.props.chartData,
      titulo:this.props.titulo,
      tipo:"barras"
    }
  }

  componentWillReceiveProps(nextProps) {
     
    this.setState(
      {
        chartData:nextProps.chartData,
        titulo:nextProps.titulo
      },
    );
}

  static defaultProps = {
    displayTitle:true,
    displayLegend: true,
    legendPosition:'right'
  }

  handleChangeMark(event) {
    let spec = event.target.value;    
    this.setState({ tipo: spec});
    console.log("EVENT "+event.target.value);
}

  graficarEn(tipoGrafica){
      if(tipoGrafica === "area"){
        return (
            <Line
                data={this.state.chartData}
                fill={false}
                lineTension={0.3}
                options={{
                    title:{
                    display:this.props.displayTitle,
                    text:'Distribución de '+this.props.titulo,
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
                data={this.state.chartData}
                options={{
                    title:{
                    display:this.props.displayTitle,
                    text:'Distribución de '+this.props.titulo,
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
                data={this.state.chartData}
                options={{
                    title:{
                    display:this.props.displayTitle,
                    text:'Distribución de '+this.props.titulo,
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
                data={this.state.chartData}
                options={{
                    title:{
                    display:this.props.displayTitle,
                    text:'Distribución de '+this.props.titulo,
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

  

  render(){
    return (
      <div>
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
        </div>
    );
  }
}

export default Grafica;
