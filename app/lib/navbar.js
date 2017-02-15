/*
 * @providesModule navbar
 */
import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { size, os } from 'lib';
import oc from 'oc';
const { BlurView } = require('react-native-blur');

class Navbar extends Component {
  render () {
    return(
      <View style={[styles.container, this.props.style]}>
        <BlurView blurType="light" blurAmount={25} style={styles.blur}>
          <View style={[styles.left, {backgroundColor: this.props.backgroundColor}]} >
            <TouchableOpacity style={styles.button} onPress={e => this.props.onLeft(e)}>
              {this.props.left || null}
            </TouchableOpacity>
          </View>
          <View style={[styles.middle, {backgroundColor: this.props.backgroundColor}]}>
            {this.props.middle || null}
          </View>
          <View style={[styles.right, {backgroundColor: this.props.backgroundColor}]} >
            <TouchableOpacity style={styles.button} onPress={e => this.props.onRight(e)}>
              {this.props.right || null}
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    )
  }
}

Navbar.defaultProps = {
  left: <Icon name="ios-arrow-back" size={24} />,
  middle: null,
  right: null,
  onLeft: () => {},
  onRight: () => {},
  backgroundColor: oc.black,
}

const styles = StyleSheet.create({
  container: {
    width: size.width,
    height: os === 'ios' ? 64 : 75,
    flexDirection: 'row',
    zIndex: 99999,
  },
  blur: {
    width: size.width,
    height: os === 'ios' ? 64 : 75,
    flexDirection: 'row',
  },
  left: {
    paddingTop: os === 'ios' ? 20 : 25,
    width: 50,
    height: os === 'ios' ? 64 : 75,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(50, 50, 55, 0.6)',
  },
  right: {
    paddingTop: os === 'ios' ? 20 : 25,
    width: 50,
    height: os === 'ios' ? 64 : 75,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(50, 50, 55, 0.6)',
  },
  middle: {
    paddingTop: os === 'ios' ? 20 : 25,
    width: size.width - 100,
    height: os === 'ios' ? 64 : 75,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(50, 50, 55, 0.6)',
  },
  button: {
    width: 50,
    height: os === 'ios' ? 64 : 75,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Navbar;
