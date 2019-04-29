import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

class ListaUsuarios extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tutores: [],
        };
      }
    
      componentWillReceiveProps(nextProps) {
         
          this.setState(
            {
              tutores: nextProps.tutores,
            },
          );
    }


  render() {
    return (
      <div className="container">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">
              BOARD LIST
            </h3>
          </div>
          <div className="panel-body">
            <table className="table table-stripe">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Author</th>
                </tr>
              </thead>
              <tbody>
                {this.state.tutores.map(tutor =>
                  <tr key={tutor.correo}>
                    <td><Link to={`/show/${tutor.key}`}>{tutor.nombre}</Link></td>
                    <td>{tutor.correo}</td>
                    <td>{tutor.edad}</td>
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

export default ListaUsuarios;