/*
 * @providesModule SongRowWithAction
 */
import React, { Component } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Navigator,
  Button, TouchableOpacity, Modal, LayoutAnimation,
  AsyncStorage, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { size, downloadOneSong } from 'lib';
import oc from 'oc';
import api from 'api';
const { BlurView } = require('react-native-blur');
import ModalButton from 'ModalButton';
import { connect } from 'react-redux';
const RNFS = require('react-native-fs');
const root = `${RNFS.DocumentDirectoryPath}/musicafe/`;

class SongRowWithAction extends Component{
  constructor(props){
    super(props);
    this.state = {
      modal: false,
      step: 1,
    }
  }

  play = () => {
    let data;
    let { fromType } = this.props;
    if(fromType !== 'userDownloadlist' && fromType !== 'UserPlaylistDetail'){
      let data = this.props.listData.map(item => {
        return {
          ...item,
          vendor: this.props.vendor,
        }
      });
      //delete cannot listen songs
      data = data.filter(i => !i.needPay && !i.offlineNow);
      this.props.updateCurrentPlaylist(data, this.props.id, fromType);
    } else {
      data = this.props.listData;
      this.props.updateCurrentPlaylist(data, this.props.id, fromType);
    }
    this.props.PlayerRouter.push({
      ident: 'Player',
      playNow: true,
      sceneConfig: {
        ...Navigator.SceneConfigs.FloatFromBottom,
        gestures: {jumpBack: Navigator.SceneConfigs.FloatFromBottom.gestures.pop}
      }
    });
  }

  showModal = () => {
    this.setState({modal: true})
  }

  hideModal = () => {
    this.setState({modal: false, step: 1});
  }

  chooseList = (e) => {
    this.setState({step: 2});
  }

  addSong = (listIdent) => {
    let { songData, fromType, albumID, cover, vendor, playlist } = this.props;
    let newSongData = {
      ...songData,
      vendor: this.props.vendor,
    }
    try {
      let addingPlaylist = playlist.filter(i => (i.ident === listIdent))[0];
      if(addingPlaylist.songs.filter(song => (song.id === songData.id && song.vendor === vendor))[0]){
        Alert.alert('歌单里面已经有这首歌了哦～ 😄');
      } else {
        this.props.addSong(listIdent, newSongData);
        AsyncStorage.setItem('playlist', JSON.stringify(this.props.playlist));
        this.setState({
          modal: false,
          step: 1,
        });
      }
    } catch (error) {
      console.log(error);
      Alert.alert('出了点问题，请稍后再添加~😯');
    }
  }

  download = (e) => {
    let {songData, fromType, cover, vendor, id, albumID, dispatch} = this.props;
    this.setState({
      modal: false,
      step: 1,
    });
    RNFS.stat(root)
      .then(res => {
        console.log('stat dir: ', res);
      })
      .catch(err => {
        RNFS.mkdir(root);
        console.log(err);
      })
    downloadOneSong(vendor, id, albumID, songData, dispatch).catch(e => {
      Alert.alert('下载出错～😯');
    });
  }

  pushToAlbum = (songData) => {
    this.setState({
      modal: false,
      step: 1,
    });
    this.props.navigator.push({
      ident: 'SonglistDetail',
      id: songData.album.id,
      vendor: this.props.vendor,
      cover: songData.album.cover,
      name: songData.album.name,
      artist: songData.artists.map(i => i.name).join(' & '),
      type: 'album'
    });
  }

  deleteSong = (fromType, songData, playlistIdent) => {
    if(fromType === 'userDownloadlist'){
      console.log('will delete song in download list');
      try{
        RNFS.unlink(songData.filePath)
          .then(() => {
            console.log(`the song: ${songData.name} has been deleted.`);
            this.props.deleteDownloadSong(songData.id, songData.vendor);
          })
      } catch(e){
        console.log(e);
      }
    } else {
      console.log('will delete song in user playlist');
      this.props.deleteSongInPlaylist(playlistIdent, songData.id);
    }
    this.setState({
      modal: false,
      step: 1,
    });
  }

  renderModal = () => {
    let action = this.state.step === 1 ? this.renderActions() : this.renderPlaylist()
    return(
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modal}
        onRequestClose={this.props.onCancel}
      >
        <View style={styles.ModalContaner}>
          <BlurView blurType="dark" blurAmount={20} style={styles.blur}>
            {action}
            <ModalButton
              style={styles.cancelButton}
              text="取消"
              onPress={e => this.hideModal()}
            />
          </BlurView>
        </View>
      </Modal>
    )
  }

  renderActions = () => {
    let { downloading, downloaded, showAlbum, fromType, songData, playlistIdent } = this.props;
    if(downloaded){
      icon = <Icon name="ios-checkmark-circle" style={{color: oc.teal3}} size={26} />
    } else if (downloading){
      icon = <ActivityIndicator size="small" />;
    } else {
      icon = null;
    }
    let basicButtonArray = [
      <ModalButton
        key={0}
        text="添加"
        onPress={this.chooseList}
      />,
      <ModalButton
        key={1}
        text="下载"
        onPress={this.download}
        icon={icon}
        disabled={downloaded || downloading}
      />
    ];
    if(showAlbum){
      basicButtonArray.push(
        <ModalButton
          key={2}
          text="专辑"
          onPress={e => this.pushToAlbum(songData)}
        />
      )
    }
    if(fromType === 'userDownloadlist' || fromType === 'userPlaylist'){
      basicButtonArray.push(
        <ModalButton
          key={3}
          text="删除"
          onPress={e => this.deleteSong(fromType, songData, playlistIdent)}
        />
      )
    }
    return basicButtonArray;
  }

  renderPlaylist = () => {
    const { playlist } = this.props;
    let buttons = playlist.map((list, index) => {
      if(list.ident === 'current'){ return null }
      return(
        <ModalButton
          key={index}
          style={index !== 0 ? {borderTopWidth: 0.5, borderTopColor: 'rgba(200, 200, 200, 0.3)'} : {}}
          text={list.name}
          onPress={e => this.addSong(list.ident)}
        />
      )
    });
    return buttons;
  }

  render(){
    LayoutAnimation.easeInEaseOut();
    let modal = this.renderModal();
    let {downloaded, downloading} = this.props;
    return(
      <View style={
        this.props.index === 0
        ? {}
        : {borderTopWidth: 1, borderTopColor: oc.gray9}
      }>
        <TouchableOpacity
          style={styles.song}
          onPress={this.play}
          disabled={this.props.canload ? false : true}
        >
          <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'flex-start'}}>
            <Text
              numberOfLines={2}
              style={{color: this.props.canload ? oc.gray1 : oc.gray5, marginLeft: 15, marginRight: 5}}
            >
              {`${this.props.index+1}. ${this.props.name}${this.props.showArtist ? (' - ' + this.props.artist) : ''}`}
            </Text>
            {
              downloaded
              ? <View style={{backgroundColor: oc.teal6, height: 8, width: 8, borderRadius: 4, marginLeft: 5}} />
              : null
            }
            {
              downloading
              ? <ActivityIndicator size="small" />
              : null
            }
            {
              this.props.canload
              ? null
              : <View style={{backgroundColor: oc.red6, height: 8, width: 8, borderRadius: 4, marginLeft: 5}} />
            }
          </View>
          <TouchableOpacity
            style={styles.rowButton}
            onPress={e => this.showModal(1)}
            disabled={this.props.canload ? false : true}
          >
            <Icon name="ios-more" color={this.props.canload ? oc.gray1 : oc.gray5} size={32} />
          </TouchableOpacity>
          {modal}
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  song: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ModalContaner: {
    flex: 1,
  },
  blur: {
    height: size.height,
    width: size.width,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    position: 'absolute',
    bottom: 80,
    left: (size.width-200)/2,
  },
  rowButton: {
    width: 60,
    height: 60,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

SongRowWithAction.defaultProps = {
  name: '',
  index: 0,
  id: null,
  vendor: '',
  artist: '',
  songData: null,
  showArtist: false,
  showAlbumInActions: false,
  onCancel: () => {},
}

const mapStateToProps = (state, props) => {
  let { vendor, id, needPay, offline } = props;
  let downloading = false, downloaded = false, canload = true;
  let tag = 0;
  if(vendor === 'xiami'){tag = 1}
  if(vendor === 'qq'){tag = 2}
  if(vendor === 'netease'){tag = 3}
  if(Object.keys(state.downloadedSong).indexOf(`${tag}${id}`) > -1){
    downloaded = true;
  } else if (state.downloadingSong.filter(i => (i.id === id && i.vendor === vendor))[0]){
    downloading = true;
  }
  if(vendor === 'netease' && (needPay || offline)){
    canload = false;
  }
  return{
    playlist: state.playlist,
    downloadedSong: state.downloadedSong,
    downloadingSong: state.downloadingSong,
    downloaded,
    downloading,
    canload,
  }
}

const mapDispatchToProps = (dispatch) => {
  return{
    addSong: (ident, song) => {
      dispatch({type: 'ADD_SONG', ident, song});
    },
    updateCurrentPlaylist: (list, songID, fromType) => {
      dispatch({type: 'UPDATE_CURRENT_PLAYLIST_WITH_SONG', list, songID, fromType});
    },
    addDownloadSong: (uiqID, songData) => {
      dispatch({type: 'ADD_DOWNLOADED_SONG', uiqID, songData});
    },
    deleteSongInPlaylist: (ident, songID) => {
      dispatch({type: 'DELETE_SONG', ident, songID});
    },
    deleteDownloadSong: (id, vendor) => {
      let tag = 0, uiqID;
      if(vendor === 'xiami'){tag = 1}
      if(vendor === 'qq'){tag = 2}
      if(vendor === 'netease'){tag = 3}
      uiqID = `${tag}${id}`;
      dispatch({type: 'DELETE_DOWNLOADED_SONG', uiqID});
    },
    dispatch,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SongRowWithAction);
