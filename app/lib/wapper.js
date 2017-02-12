/*
 * @providesModule wapper
 */

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import oc from 'oc';

class Wapper extends Component{
  render(){
    return(
      <View style={[styles.wapper, this.props.style]}>
        {this.props.children}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wapper: {
    flex: 1,
    backgroundColor: oc.black,
  }
})

export default Wapper
