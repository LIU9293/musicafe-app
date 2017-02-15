/*
 * @providesModule PrimaryButton
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
    height: 36,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: oc.teal6,
    borderRadius: 3,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  }
})

ModalButton.defaultProps = {
  textStyle: {},
  text: '',
  onPress: () => {},
}

export default ModalButton
