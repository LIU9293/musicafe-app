/*
 * @providesModule MusicIcon
 */

import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Image, View } from 'react-native';

const GIF = require('../../assets/images/wave.gif');
const Nowave = require('../../assets/images/nowave.png');

class MusicIcon extends Component{
  render(){
    if(this.props.playing === 3){
      return(
        <Image source={GIF} style={{width: 15, height: 15}} />
      )
    } else if(this.props.playing === 2){
      return(
        <Image source={Nowave} style={{width: 15, height: 15}} />
      )
    } else {
      return (
        <View />
      )
    }
  }
}

function mapStateToProps(state){
  return {
    playing: state.appStatus.playing
  }
}

export default connect(mapStateToProps)(MusicIcon)
