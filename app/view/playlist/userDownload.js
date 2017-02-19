import React, { Component } from 'react';
import { View, StyleSheet, AsyncStorage, Text, TouchableHighlight,
  ScrollView, Navigator } from 'react-native';
import Wapper from 'wapper';
import { connect } from 'react-redux';
import { size } from 'lib';
import oc from 'oc'
import SongRowWithAction from 'SongRowWithAction';

class UserDownload extends Component{
  constructor(props){
    super(props);
  }

  render(){
    let list;
    console.log(Object.values(this.props.downloadedSong));
    list = Object.values(this.props.downloadedSong).map((song, index) => {
      return (
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
          fromType={'userDownloadlist'}
          listData={Object.values(this.props.downloadedSong)}
          PlayerRouter={this.props.PlayerRouter}
          showAlbum={true}
        />
      )
    });
    return(
      <Wapper>
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
    height: size.height - 64,
    width: size.width,
    paddingBottom: 64,
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
