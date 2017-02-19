/*
 * @providesModule Error
 */
import React, { Component } from 'react';
import { View, Text, StyleSheet,
  TouchableOpacity } from 'react-native';
import oc from 'oc';

class Error extends Component{
  render(){
    return(
      <View style={[{justifyContent: 'center', alignItems: 'center'}, this.props.style]}>
        <Text style={{color: oc.white}}>{this.props.message}</Text>
        <TouchableOpacity onPress={this.props.onPress} style={styles.reloadButton}>
          <Text style={{color: oc.white}}>重新加载</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  reloadButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 36,
    width: 100,
    borderColor: oc.white,
    borderWidth: 1,
    borderRadius: 3,
    marginTop: 30,
  }
})

Error.defaultProps = {
  onPress: () => {},
  message: '出错了～ 😯'
}

export default Error
