/*
 * @providesModule UserPlaylistDetail
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Text, TouchableOpacity, Navigator, Image,
  TouchableHighlight, ScrollView, ListView, AsyncStorage, Alert } from 'react-native';
import Wapper from 'wapper';
import oc from 'oc';
import { size } from 'lib';
import Navbar from 'navbar';
import Icon from 'react-native-vector-icons/Ionicons';
import { SwipeListView } from 'react-native-swipe-list-view';
import MusicIcon from 'MusicIcon';
import SongRowWithAction from 'SongRowWithAction';
import { jumpForward } from 'lib';

class UserPlaylistDetail extends Component{

  constructor(props){
    super(props);
    this.deleteSong = this.deleteSong.bind(this);
  }

  deleteSong(song){
    this.props.deleteSong(this.props.ident, song.id);
    try {
      AsyncStorage.setItem('playlist', JSON.stringify(this.props.playlist));
    } catch (error) {
      Alert.alert('出了点问题，请稍后重试~😯');
    }
  }

  render(){
    let currentList = this.props.playlist.filter(x => x.ident === this.props.ident)[0];
    let list;
    if(currentList){
      list = currentList.songs.map((song, index) => {
        return(
          <SongRowWithAction
            navigator={this.props.navigator}
            key={index}
            songData={song}
            index={index}
            name={song.name}
            id={song.id}
            needPay={song.needPay || false}
            offline={song.offline || false}
            vendor={song.vendor}
            artist={song.artists.map(i => i.name).join(' & ')}
            albumID={song.album.id}
            cover={song.album.cover}
            showArtist={true}
            fromType={'userPlaylist'}
            listData={currentList.songs}
            PlayerRouter={this.props.PlayerRouter}
            showAlbum={true}
            playlistIdent={this.props.ident}
          />
        )
      });
    }
    return(
      <Wapper>
        <Navbar
         left={<Icon name="ios-arrow-back" size={24} style={{color: oc.gray1}} />}
         middle={<Text numberOfLines={1} style={{color: oc.gray1}}>{this.props.name}</Text>}
         onLeft={(e) => {this.props.navigator.pop()}}
         right={<MusicIcon />}
         onRight={(e) => {jumpForward(this.props.PlayerRouter)}}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scroll}
        >
          {list}
        </ScrollView>
      </Wapper>
    )
  }
}

const styles = StyleSheet.create({
  scroll: {
    position: 'absolute',
    height: size.height,
    width: size.width,
    paddingTop: 64,
  },
});

const mapStateToProps = (state) => {
  return{
    playlist: state.playlist,
    downloadedSong: state.downloadedSong
  }
}

const mapDispatchToProps = (dispatch) => {
  return{
    deleteSong: (ident, songID) => {
      dispatch({type: 'DELETE_SONG', ident, songID})
    },
    updateCurrentPlaylist: (list, songID) => {
      dispatch({type: 'UPDATE_CURRENT_PLAYLIST_WITH_SONG', list, songID})
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPlaylistDetail)
