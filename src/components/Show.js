import React, { Component } from 'react';
import firebase from '../Firebase';
import { Link } from 'react-router-dom';

class Show extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tutor: {},
      key: ''
    };
  }

  componentDidMount() {
    const ref = firebase.firestore().collection('tutores').doc(this.props.match.params.id);
    ref.get().then((doc) => {
      if (doc.exists) {
        this.setState({
          tutor: doc.data(),
          key: doc.id,
          isLoading: false
        });
      } else {
        console.log("No such document!");
      }
    });
  }


  render() {
    return (
      <div className="container">
        <div className="panel panel-default">
          <div className="panel-heading">
          <h4><Link to="/">Board List</Link></h4>
            <h3 className="panel-title">
              {this.state.tutor.nombre}
            </h3>
          </div>
          <div className="panel-body">
            <dl>
              <dt>Description:</dt>
              <dd>{this.state.tutor.correo}</dd>
              <dt>Author:</dt>
              <dd>{this.state.tutor.edad}</dd>
            </dl>
          </div>
        </div>
      </div>
    );
  }
}

export default Show;