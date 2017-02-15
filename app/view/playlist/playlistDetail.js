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
import { jumpForward } from 'lib';

class UserPlaylistDetail extends Component{

  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      data: [],
      dataSource: ds.cloneWithRows([]),
    }
    this.renderSongs = this.renderSongs.bind(this);
    this.getData = this.getData.bind(this);
    this.deleteSong = this.deleteSong.bind(this);
    this.renderSongs = this.renderSongs.bind(this);
    this.renderDeleteButton = this.renderDeleteButton.bind(this);
    this.pushToPlayer = this.pushToPlayer.bind(this);
  }

  componentDidMount(){
    this.getData();
  }

  componentWillReceiveProps(nextProps){
    this.getData();
  }

  getData(){
    let currentList = this.props.playlist.filter(x => x.ident === this.props.ident)[0];
    this.setState({
      data: currentList.songs,
      dataSource: this.state.dataSource.cloneWithRows(currentList.songs),
    })
  }

  deleteSong(song){
    this.props.deleteSong(this.props.ident, song.id);
    try {
      AsyncStorage.setItem('playlist', JSON.stringify(this.props.playlist));
    } catch (error) {
      Alert.alert('出了点问题，请稍后重试~😯');
    }
  }

  pushToPlayer(songID){
    let newData = [...this.state.data].map(item => {
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

  renderSongs(data, id, id2){
    id2 = parseInt(id2);

    //if is downloaded, give a tag
    let { vendor } = data;
    let songID = data.id;
    let { downloadedSong } = this.props;
    let isDownloaded = false;
    let tag = 0;
    if(vendor === 'xiami'){tag = 1}
    if(vendor === 'qq'){tag = 2}
    if(vendor === 'netease'){tag = 3}
    if(Object.keys(downloadedSong).indexOf(`${tag}${songID}`) > -1){
      isDownloaded = true;
    }
    return(
      <TouchableHighlight style={{borderTopColor: id2 === 0 ? oc.black : oc.gray7}}
        onPress={e => this.pushToPlayer(songID)}
      >
        <View style={styles.row}>
          <Text style={styles.text}>
            {`${id2+1}. ${data.name} - ${data.artists.map(i => i.name).join('&')}`}
          </Text>
          {
            isDownloaded
            ? <View style={{backgroundColor: oc.teal6, height: 8, width: 8, borderRadius: 4, marginLeft: 10}} />
            : null
          }
        </View>
      </TouchableHighlight>
    )
  }

  renderDeleteButton(data){
    return(
      <TouchableOpacity style={styles.rowBack} onPress={e => this.deleteSong(data)}>
          <Text style={{color: oc.gray1}}>删除</Text>
      </TouchableOpacity>
    )
  }

  render(){
    return(
      <Wapper>
        <Navbar
         left={<Icon name="ios-arrow-back" size={24} style={{color: oc.gray1}} />}
         middle={<Text numberOfLines={1} style={{color: oc.gray1}}>{this.props.name}</Text>}
         onLeft={(e) => {this.props.navigator.pop()}}
         right={<MusicIcon />}
         onRight={(e) => {jumpForward(this.props.PlayerRouter)}}
        />
        <SwipeListView
            dataSource={this.state.dataSource}
            renderRow={this.renderSongs}
            renderHiddenRow={this.renderDeleteButton}
            rightOpenValue={-75}
            disableRightSwipe={true}
            closeOnRowPress={true}
            enableEmptySections={true}
        />
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
  rowBack: {
    marginLeft: size.width/2,
    width: size.width/2,
    height: 64,
    backgroundColor: oc.red6,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 23,
  }
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
