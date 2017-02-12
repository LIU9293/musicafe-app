/*
 * @providesModule SongRowWithAction
 */
import React, { Component } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Navigator,
  Button, TouchableOpacity, Modal, LayoutAnimation, AsyncStorage, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { size } from 'lib';
import oc from 'oc';
const { BlurView } = require('react-native-blur');
import ModalButton from 'ModalButton';
import { connect } from 'react-redux';

class SongRowWithAction extends Component{
  constructor(props){
    super(props);
    this.state = {
      modal: false,
      step: 1,
    }
    this.play = this.play.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.addSong = this.addSong.bind(this);
    this.download = this.download.bind(this);
    this.chooseList = this.chooseList.bind(this);
    this.renderModal = this.renderModal.bind(this);
    this.renderActions = this.renderActions.bind(this);
    this.renderPlaylist = this.renderPlaylist.bind(this);
  }

  play(){
    let data = this.props.listData.map(item => {
      return {
        ...item,
        vendor: this.props.vendor,
      }
    });
    if(!data.album){
      data = data.map(item => {
        return {
          ...item,
          album: {
            id: this.props.albumID,
            cover: this.props.cover
          }
        }
      })
    }
    this.props.updateCurrentPlaylist(data, this.props.id);
    //this.props.navigator.jumpTo(this.props.navigator.getCurrentRoutes()[0]);
    this.props.navigator.push({
      ident: 'Player',
      playNow: true,
      sceneConfig: {
        ...Navigator.SceneConfigs.PushFromRight,
        gestures: {jumpBack: Navigator.SceneConfigs.PushFromRight.gestures.pop}
      }
    });
  }

  showModal(){
    this.setState({modal: true})
  }

  hideModal(){
    this.setState({modal: false, step: 1});
  }

  chooseList(e){
    this.setState({step: 2});
  }

  addSong(listIdent){
    let { songData, fromType, albumID, cover, vendor } = this.props;
    if(fromType === 'album'){
      songData = {
        ...songData,
        album: {cover: cover, id: albumID}
      }
    }
    let newSongData = {
      ...songData,
      vendor: this.props.vendor,
    }
    this.setState({
      modal: false,
      step: 1,
    });
    this.props.addSong(listIdent, newSongData);
    try {
      AsyncStorage.setItem('playlist', JSON.stringify(this.props.playlist));
    } catch (error) {
      Alert.alert('出了点问题，请稍后再添加~😯');
    }
  }

  download(){

  }

  renderModal(){
    let action = this.state.step === 1 ? this.renderActions() : this.renderPlaylist()
    return(
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modal}
        onRequestClose={this.props.onCancel}
      >
        <View style={styles.ModalContaner}>
          <BlurView blurType="dark" blurAmount={10} style={styles.blur}>
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

  renderActions(){
    return([
      <ModalButton
        key={0}
        style={{borderBottomWidth: 0.5, borderBottomColor: 'rgba(200, 200, 200, 0.3)'}}
        text="添加"
        onPress={this.chooseList}
      />,
      <ModalButton
        key={1}
        text="下载"
        onPress={this.download}
      />
    ])
  }

  renderPlaylist(){
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
    return(
      <TouchableOpacity style={[styles.song, {
          borderTopColor: this.props.index === 0 ? oc.black : oc.gray8
        }]}
        onPress={this.play}
      >
        <Text
          numberOfLines={2}
          style={{color: oc.gray1, flex: 1, marginHorizontal: 15}}
        >
          {`${this.props.index+1}. ${this.props.name}${this.props.showArtist ? (' - ' + this.props.artist) : ''}`}
        </Text>
        <TouchableOpacity style={styles.rowButton} onPress={e => this.showModal(1)}>
          <Icon name="ios-more" color={oc.gray1} size={32} />
        </TouchableOpacity>
        {modal}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  song: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 0.5,
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
  songInfo: null,
  showArtist: false,
  showAlbumInActions: false,
  onCancel: () => {},
}

const mapStateToProps = (state) => {
  return{
    playlist: state.playlist
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

export default connect(mapStateToProps, mapDispatchToProps)(SongRowWithAction);
