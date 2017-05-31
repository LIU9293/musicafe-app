/*
 * @providesModule gradient
 */
import React, { Component } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
const BG = require('../../assets/images/bg.png');
import { size } from 'lib';

class Gardient extends Component{
  render(){
    return(
      <View style={styles.container}>
        <LinearGradient colors={['#228AE6', '#15AABF', '#12B786']} style={styles.LinearGradient}>
        </LinearGradient>
        <Image
          source={BG}
          style={styles.container}
          resizeMode="contain"
        />
      </View>
    )
  }
}

const styles = {
  container: {
    width: size.width,
    height: 220,
  },
  LinearGradient: {
    width: size.width,
    height: 160,
    position: 'absolute',
    top: 30,
  }
}

export default Gardient
