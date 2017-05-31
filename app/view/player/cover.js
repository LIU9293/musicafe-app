import React, { Component } from 'react';
import { Image, StyleSheet, LayoutAnimation } from 'react-native';
import { size } from 'lib';
const { BlurView } = require('react-native-blur');

class Cover extends Component{
  shouldComponentUpdate(nextProps){
    if(nextProps.uri !== this.props.uri){
      return true;
    } else {
      return false;
    }
  }
  render(){
    LayoutAnimation.easeInEaseOut();
    return(
      <Image source={{uri: this.props.uri, cache: "force-cache"}} resizeMode={'contain'} style={this.props.style} />
    )
  }
}

class BackgroundCover extends Component{

  shouldComponentUpdate(nextProps){
    if(nextProps.uri !== this.props.uri){
      return true;
    } else {
      return false;
    }
  }

  render(){
    LayoutAnimation.easeInEaseOut();
    return(
      <Image source={{uri: this.props.uri, cache: "force-cache"}} resizeMode="cover" style={styles.blur}>
        <BlurView blurType="dark" blurAmount={40} style={styles.blur}>
        </BlurView>
      </Image>
    )
  }
}

const styles = StyleSheet.create({
  blur: {
    zIndex: -1,
    position: 'absolute',
    height: size.height,
    width: size.width,
    top: 0,
    left: 0,
  },
})

module.exports = {Cover, BackgroundCover}
