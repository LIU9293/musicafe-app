/*
 * @providesModule app
 */
import React, { Component } from 'react';
import store from 'store';
import Route from 'route';
import PlayerRouter from 'PlayerRouter';
import { Provider } from 'react-redux';

class App extends Component{
  render(){
    return(
      <Provider store={store}>
        <PlayerRouter />
      </Provider>
    )
  }
}

export default App
