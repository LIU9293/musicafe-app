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
        <TouchableOpacity
          onPress={this.props.onPress}
          style={[styles.button, this.props.textStyle]}
          disabled={this.props.disabled || false}
        >
          <Text style={styles.text}>{this.props.text}</Text>
          {this.props.icon || null}
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
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    color: oc.gray1,
    fontSize: 20,
    marginHorizontal: 10,
  }
})

ModalButton.defaultProps = {
  textStyle: {},
  text: '',
  onPress: () => {},
}

export default ModalButton
