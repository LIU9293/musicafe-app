/*
 * @providesModule SonglistDetail
 */
import React, { Component } from 'react';
import { View, Text, ScrollView, InteractionManager,
  Image, StyleSheet, TouchableOpacity, Navigator } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import SongRowWithAction from 'SongRowWithAction';
import { size, jumpForward } from 'lib';
import api from 'api';
import Navbar from 'navbar';
import Wapper from 'wapper';
import oc from 'oc';
import Loading from 'Loading';
import MusicIcon from 'MusicIcon';
import PrimaryButton from 'PrimaryButton';
import Error from 'Error';

class SonglistDetail extends Component{

  constructor(props){
    super(props);
    this.state = {
      loaded: false,
      listData: null,
      err: null,
    }
    this.playAll = this.playAll.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount(){
    InteractionManager.runAfterInteractions(() => {
      this.loadData();
    })
  }

  loadData(){
    api[`get${this.props.type}`](this.props.vendor, this.props.id)
      .then(res => {
        this.setState({listData: res, loaded: true, err: null});
      })
      .catch(err => {
        console.log(err);
        this.setState({
          err: err === 'timeout' ? 'timeout' : 'network err'
        });
      })
  }

  playAll(e){
    let data = this.state.listData.songList.map(item => {
      return {
        ...item,
        vendor: this.props.vendor,
      }
    });
    if(this.props.vendor === 'netease'){
      //if is netease, we need to filter out the cannot play song first.
      data = data.filter(i => (i.needPay === false && i.offline === false));
    }
    this.props.updateCurrentPlaylist(data);
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
    let lists;
    if(this.state.err){
      return (
        <Wapper style={{backgroundColor: oc.black}}>
          <Navbar
            left={<Icon name="ios-arrow-back" size={24} style={{color: oc.gray1}} />}
            right={<MusicIcon />}
            onRight={(e) => {jumpForward(this.props.PlayerRouter)}}
            middle={<Text numberOfLines={1} style={{color: oc.gray1}}>{this.props.name}</Text>}
            onLeft={(e) => {this.props.navigator.pop()}}
          />
          <ScrollView style={styles.scroll}>
            <View style={styles.header}>
              <Image source={{uri: this.props.cover}} style={styles.cover}/>
              <View style={styles.description}>
                <View style={{marginLeft: 20}}>
                  <Text style={{fontSize: 17, color: oc.gray1}}>{this.props.name}</Text>
                  <Text style={{fontSize: 12, marginTop: 15,  color: oc.gray3}}>
                    {this.props.artist}
                  </Text>
                </View>
                <View style={{marginLeft: 20}}>
                  <PrimaryButton
                    style={{backgroundColor: oc.gray5}}
                    disabled={true}
                    text={'全部播放'}
                    onPress={this.playAll}
                  />
                </View>
              </View>
            </View>
            <Error onPress={this.loadData} style={{marginTop: 80}} />
          </ScrollView>
        </Wapper>
      )
    }

    if(this.state.loaded){
      lists = this.state.listData.songList.map((song, index) => {
        return(
          <SongRowWithAction
            navigator={this.props.navigator}
            key={index}
            songData={song}
            index={index}
            name={song.name}
            id={song.id}
            needPay={song.needPay}
            offline={song.offline || false}
            vendor={this.props.vendor}
            artist={song.artists.map(i => i.name).join(' & ')}
            albumID={this.props.type === 'album' ? this.props.id : song.album.id}
            cover={this.props.type === 'album' ? this.props.cover : song.album.cover}
            showArtist={this.props.type === 'album' ? false : true}
            fromType={this.props.type}
            listData={this.state.listData.songList}
            PlayerRouter={this.props.PlayerRouter}
            showAlbum={this.props.type === 'album' ? false : true}
          />
        )
      })
    }
    let canplay = true;
    if(this.state.listData){
      if(this.props.vendor === 'netease' && (this.state.listData.needPay || this.state.listData.offline)){
        canplay = false;
      }
    }
    if(!this.state.loaded){
      canplay = false;
    }
    return(
      <Wapper style={{backgroundColor: oc.black}}>
        <Navbar
          left={<Icon name="ios-arrow-back" size={24} style={{color: oc.gray1}} />}
          right={<MusicIcon />}
          onRight={(e) => {jumpForward(this.props.PlayerRouter)}}
          middle={<Text numberOfLines={1} style={{color: oc.gray1}}>{this.props.name}</Text>}
          onLeft={(e) => {this.props.navigator.pop()}}
        />
        <ScrollView style={styles.scroll}>
          <View style={styles.header}>
            <Image source={{uri: this.props.cover}} style={styles.cover}/>
            <View style={styles.description}>
              <View style={{marginLeft: 20}}>
                <Text style={{fontSize: 17, color: oc.gray1}}>{this.props.name}</Text>
                <Text style={{fontSize: 12, marginTop: 15,  color: oc.gray3}}>
                  {this.props.artist}
                </Text>
              </View>
              <View style={{marginLeft: 20}}>
                <PrimaryButton
                  style={{backgroundColor: canplay ? oc.teal6 : oc.gray5}}
                  disabled={canplay ? false : true}
                  text={'全部播放'}
                  onPress={this.playAll}
                />
              </View>
            </View>
          </View>
          {
            this.state.loaded
            ? lists
            : <View style={{width: size.width, height: 300}}><Loading /></View>
          }
        </ScrollView>
      </Wapper>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    padding: 15,
    flexDirection: 'row',
  },
  description: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cover: {
    height: 150,
    width: 150,
  },
  scroll: {
    position: 'absolute',
    height: size.height,
    width: size.width,
    paddingTop: 64,
  },
  song: {
    flexDirection: 'row',
    height: 50,
    borderBottomWidth: 0.5,
    borderBottomColor: oc.gray5,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  artistName: {
    height: 50,
    width: 60,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rowButton: {
    height: 50,
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  }
});

const mapStateToProps = (state, props) => {
  return {
    playing: state.appStatus.playing
  }
}

const mapDispatchToProps = (dispatch) => {
  return{
    updateCurrentPlaylist: (list, songID) => {
      dispatch({type: 'UPDATE_CURRENT_PLAYLIST_WITH_SONG', list, songID})
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SonglistDetail)
