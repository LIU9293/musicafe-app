/*
 * @providesModule Loading
 */
import React, { Component } from 'react';
import Wapper from 'wapper';
import oc from 'oc';
var Spinner = require('react-native-spinkit');

class Loading extends Component{
  render(){
    return(
      <Wapper style={{justifyContent: 'center', alignItems: 'center'}}>
        <Spinner
          type={'Pulse'}
          color={oc.gray1}
        />
      </Wapper>
    )
  }
}

export default Loading
