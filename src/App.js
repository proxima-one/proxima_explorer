import React, { Component } from 'react';
import './App.css';
import Nav from "./layouts/Nav"
import Server from "./layouts/Server"
import { Route, Switch, Redirect } from "react-router-dom";
import Dialog from './layouts/Dialog'

class App extends Component {
  constructor(props) {
    super(props)

    this.state={

    }

  }


  componentDidMount() {

    document.title = "Proxima Explorer";

  }
  
  render() {
    return (
      <div>
        <Nav>
          <Switch>
            <Route exact path="/" component={Server} />

            <Redirect from="*" to="/" />
          </Switch>
        </Nav>
        <Dialog />
      </div>

    );
  }
}

export default App;
