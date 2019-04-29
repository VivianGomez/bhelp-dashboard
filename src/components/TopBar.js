import React, { Component } from 'react';
import '../App.css';

class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numeroTutores: this.props.numeroTutores,
      numeroPrimerizos:this.props.numeroPrimerizos,
      conTodosSusHijos:this.props.conTodosSusHijos,
      totalNinos: this.props.totalNinos,
      numeroActivos: this.props.numeroActivos
    };
  }

  componentWillReceiveProps(nextProps) {
     
      this.setState(
        {
          numeroTutores: nextProps.numeroTutores,
          numeroPrimerizos: nextProps.numeroPrimerizos,
          conTodosSusHijos: nextProps.conTodosSusHijos,
          totalNinos: nextProps.totalNinos,
          numeroActivos: nextProps.numeroActivos
        },
      );
}


  render() {
    return (
        <div className="container">
        <br />
        <div className="row">
            <div className="col-md-4 col-xl-3">
                <div className="card bg-c-blue order-card">
                    <div className="card-block">
                        <h6 className="m-b-20" align="center">Total usuarios registrados</h6>
                        <h2 className="text-right"><i className="fa fa-users f-left"></i><span>{this.state.numeroTutores}</span></h2>
                        <p className="m-b-0">Activos<span className="f-right">{this.state.numeroActivos}</span></p>
                    </div>
                </div>
            </div>

            <div className="col-md-4 col-xl-3">
                <div className="card bg-c-green order-card">
                    <div className="card-block">
                        <h6 className="m-b-20"  align="center">% Padres primerizos</h6>
                        <h2 className="text-right" ><i className="fas fa-baby-carriage f-left"></i><span>{Math.trunc((this.state.numeroPrimerizos/this.state.numeroTutores)*100)+"%"}</span></h2>
                        <p className="m-b-0">{this.state.numeroPrimerizos+"/"+this.state.numeroTutores} <span className="f-right"></span></p>
                    </div>
                </div>
            </div>
            
            <div className="col-md-4 col-xl-3">
                <div className="card bg-c-yellow order-card">
                    <div className="card-block">
                        <h6 className="m-b-20"  align="center">Con todos sus hijos</h6>
                        <h2 className="text-right"><i className="fas fa-baby f-left"></i><span>{this.state.conTodosSusHijos}</span></h2>
                        <p className="m-b-0">Actualizado <span className="f-right"></span></p>
                    </div>
                </div>
            </div>
            
            <div className="col-md-4 col-xl-3">
                <div className="card bg-c-pink order-card">
                    <div className="card-block">
                        <h6 className="m-b-20"  align="center">Niños registrados</h6>
                        <h2 className="text-right"><i className="fas fa-child f-left"></i><span>{this.state.totalNinos}</span></h2>
                        <p className="m-b-0">Activos<span className="f-right">{this.state.numeroActivos+3}</span></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
  }
}

export default TopBar;