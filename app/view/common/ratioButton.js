/*
 * @providesModule ratio
 */
import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import oc from 'oc';

class Ratio extends Component {
  render () {
    return(
      <TouchableHighlight
        style={[styles.button, {
          borderColor: this.props.checked ? oc.gray1 : oc.gray6
        }, this.props.style]}
        onPress={this.props.onPress}
      >
        <Text style={[styles.text, {
          color: this.props.checked ? oc.gray1 : oc.gray6
        }, this.props.textStyle]}>
          {this.props.text}
        </Text>
      </TouchableHighlight>
    )
  }
}

Ratio.defaultProps = {
  checked: false,
  onPress: () => {},
}

const styles = StyleSheet.create({
  button: {
    width: 250,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  text: {
    fontSize: 18,
  },
})

export default Ratio;
