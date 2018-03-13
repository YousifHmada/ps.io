import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

function ProcessList(props) {
  const results = props.items.map((value, index)=>
      <a key={'item_' + index} className="col">{value}</a>
  );
  return (
      results
  )
}


function ProcessBoard(props) {
  const results = props.items.map((value, index)=>
    <div key={'list_' + index} className="connected row">
        <ProcessList items={value}/>
    </div>
  );
  return (
    results
  )
}

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [['p1', 'p2', 'p3'], ['p2', 'p3'], ['p1', 'p2', 'p3', 'p4']]
    }
  }
  render() {
    return (
      <section id="connected">
        <ProcessBoard items={this.state.items}/>
      </section>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Board />
      </div>
    );
  }
}

export default App;
