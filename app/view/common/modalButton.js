/*
 * @providesModule ModalButton
 */
import React, { Component } from 'react';
import { View, Text, StyleSheet,
  TouchableOpacity } from 'react-native';
import oc from 'oc';

class ModalButton extends Component{
  render(){
    return(
      <View style={[styles.container, this.props.style]}>
        <TouchableOpacity onPress={this.props.onPress} style={[styles.button, this.props.textStyle]}>
          <Text style={styles.text}>{this.props.text}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: oc.gray1,
    fontSize: 20,
  }
})

ModalButton.defaultProps = {
  textStyle: {},
  text: '',
  onPress: () => {},
}

export default ModalButton
