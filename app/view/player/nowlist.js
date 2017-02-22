/*
 * @providesModule NowList
 */

 import React, { Component } from 'react';
 import { View, Text, StyleSheet, TouchableOpacity,
   InteractionManager, Alert, ScrollView, Image } from 'react-native';
 import { size } from 'lib';
 const { height, width } = size;
 import oc from 'oc';
 const GIF = require('../../assets/images/wave.gif');
 const Nowave = require('../../assets/images/nowave.png');

class NowList extends Component{
  constructor(props){
    super(props);
    this.nextSong = this.nextSong.bind(this);
    this.renderlist = this.renderlist.bind(this);
  }
  nextSong(id, vendor){
    this.props.nextSong(id, vendor);
  }

  renderlist(){
    let { list, id, vendor, playing } = this.props;
    return list.map((song, index) => {
      let icon = null;
      if(song.id === id && song.vendor === vendor && playing){
        icon = <Image source={GIF} style={{width: 15, height: 15}} />
      } else if (song.id === id && song.vendor === vendor){
        icon = <Image source={Nowave} style={{width: 15, height: 15}} />
      }
      return(
        <View style={styles.row} key={index}>
          <TouchableOpacity
            disabled={(song.id === id && song.vendor === vendor) ? true : false}
            style={styles.touch}
            onPress={() => this.nextSong(song.id, song.vendor)}
          >
            <Text
              style={{color: oc.white, backgroundColor: 'transparent'}}
              numberOfLines={2}
            >
              {`${index+1}. ${song.name} - ${song.artist || song.artists.map(i => i.name).join(' & ')}`}
            </Text>
            {icon}
          </TouchableOpacity>
        </View>
      )
    });
  }

  render(){
    return(
      <ScrollView
        contentContainerStyle={styles.contentStyle}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        {this.props.list ? this.renderlist() : null}
      </ScrollView>
    )
  }
}

 const styles = StyleSheet.create({
   contentStyle: {
     paddingHorizontal: 20,
   },
   row: {
     height: 50,
     flex: 1,
     width: width - 40,
     justifyContent: 'space-between',
     alignItems: 'center',
   },
   touch: {
     justifyContent: 'space-between',
     flexDirection: 'row',
     alignItems: 'center',
     width: width - 40,
     flex: 1,
   },
   scroll: {
     height: (height - 64 - 10 - 60 - 100),
     width: width,
     marginHorizontal: 0
   }
 });

 export default NowList;
