import React, { Component } from 'react';
import { View, StyleSheet, AsyncStorage, Text, TouchableHighlight,
  ScrollView, Navigator } from 'react-native';
import Wapper from 'wapper';
import { connect } from 'react-redux';
import { size } from 'lib';
import oc from 'oc'
const RNFS = require('react-native-fs');
const root = `${RNFS.DocumentDirectoryPath}/musicafe/`;

class UserDownload extends Component{
  constructor(props){
    super(props);
    this.pushToPlayer = this.pushToPlayer.bind(this);
  }

  pushToPlayer(songID){
    let newData = Object.values(this.props.downloadedSong).map(item => {
      if(!item.artist){
        return {
          ...item,
          artist: item.artists.map(i => i.name).join(' & '),
        }
      }
    });
    this.props.updateCurrentPlaylist(newData, songID);
    this.props.PlayerRouter.push({
      ident: 'Player',
      playNow: true,
      sceneConfig: {
        ...Navigator.SceneConfigs.FloatFromBottom,
        gestures: {jumpBack: Navigator.SceneConfigs.FloatFromBottom.gestures.pop}
      }
    });
  }

  render(){
    let list;
    console.log(Object.values(this.props.downloadedSong));
    list = Object.values(this.props.downloadedSong).map((song, index) => {
      return (
        <TouchableHighlight style={[styles.row, {
            borderTopColor: index === 0 ? oc.black : oc.gray7
          }]}
          key={index}
          onPress={e => this.pushToPlayer(song.id)}
        >
          <Text style={styles.text}>
            {`${index+1}. ${song.name} - ${song.artists.map(i => i.name).join('&')}`}
          </Text>
        </TouchableHighlight>
      )
    });
    return(
      <Wapper>
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          {list}
        </ScrollView>
      </Wapper>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    height: 64,
    width: size.width,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderTopWidth: 0.5,
    backgroundColor: oc.black
  },
  text: {
    color: oc.gray1,
  },
});

const mapStateToProps = (state) => {
  return{
    downloadedSong: state.downloadedSong
  }
}

const mapDispatchToProps = (dispatch) => {
  return{
    addSong: (ident, song) => {
      dispatch({type: 'ADD_SONG', ident, song});
    },
    updateCurrentPlaylist: (list, songID) => {
      dispatch({type: 'UPDATE_CURRENT_PLAYLIST_WITH_SONG', list, songID})
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDownload)
