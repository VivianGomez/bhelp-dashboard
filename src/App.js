import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import { runInThisContext } from 'vm';
import AnaliticaDemografia from './components/AnaliticaDemografia';


class App extends Component {
  constructor(props) {
    super(props);

  }


  render() {
    return (
        <div>
          <div >
            <AnaliticaDemografia/>
          </div>
      </div>
    );
  }
}

export default App;