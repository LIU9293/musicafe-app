/*
 * @providesModule Player
 */

import React, { Component } from 'react';
import { View, Text, StyleSheet, Slider, TouchableOpacity, InteractionManager,
  Image, Alert, ActivityIndicator, ScrollView, LayoutAnimation } from 'react-native';
import Video from 'react-native-video';
import oc from 'oc';
import api from 'api';
import Wapper from 'wapper';
import Icon from 'react-native-vector-icons/Ionicons';
import { size, downloadOneSong } from 'lib';
import { connect } from 'react-redux';
import MusicControl from 'react-native-music-control';
const { BlurView } = require('react-native-blur');
import NowList from 'NowList';
import Navbar from 'navbar';
const { height, width } = size;

class Player extends Component{
  constructor(props){
    super(props);
    this.state = {
      cover: '',
      name: '',
      artist: '',
      random: true,
      playing: this.props.playNow,
      mute: false,
      vendor: '',
      id: '',
      loaded: false,
      url: null,
      songLength: 1,
      currentPosition: 0,
      songlist: [],
      nextSong: {},
      enableBackground: false,
    };
    this.isDragging = false;
    this.mute = this.mute.bind(this);
    this.changeSwitchType = this.changeSwitchType.bind(this);
    this.PlayOrPause = this.PlayOrPause.bind(this);
    this.getSongURL = this.getSongURL.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.setTime = this.setTime.bind(this);
    this.setSongPosition = this.setSongPosition.bind(this);
    this.dragSlider = this.dragSlider.bind(this);
    this.getNextSong = this.getNextSong.bind(this);
    this.getNextSongURL = this.getNextSongURL.bind(this);
    this.manuallySetNextSong = this.manuallySetNextSong.bind(this);
    this.setupController = this.setupController.bind(this);
    this.downloadSong = this.downloadSong.bind(this);
    this.playNextSong = this.playNextSong.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(JSON.stringify(nextProps.currentList) !== JSON.stringify(this.state.songlist)){
      this.setState({ songlist: nextProps.currentList });
    }
    if(nextProps.defaultSongID !== this.props.defaultSongID){
      this.setState({ songlist: nextProps.currentList }, () => {
        this.getSongInfoFromList();
      });
    }
  }

  componentDidMount(){
    InteractionManager.runAfterInteractions(() => {
      this.setState({ songlist: this.props.currentList }, () => {
        this.getSongInfoFromList();
      });
      this.props.changePlayStatus(3);
    });
    this.setupController(false);
    MusicControl.enableBackgroundMode(true);
    MusicControl.on('play', ()=> {
      if(this.state.playing){
        return
      }
      this.PlayOrPause();
      this.setupController(true);
    })
    MusicControl.on('pause', ()=> {
      if(this.state.playing){
        this.PlayOrPause();
      }
      this.setupController(false);
    })
    MusicControl.on('nextTrack', () => {
      this.manuallySetNextSong();
    });
    MusicControl.on('skipBackward', () => {
      if(this.state.currentPosition < 15){
        this.setSongPosition(0);
      } else {
        this.setSongPosition(this.state.currentPosition - 15);
      }
    });
  }

  componentWillUnmount(){
    this.props.changePlayStatus(1);
    MusicControl.resetNowPlaying();
  }

  downloadSong(){
    //first, get current song info
    let {songlist, vendor, id} = this.state;
    let { dispatch } = this.props;
    let nowPlayingSong = songlist.filter(i => (i.id === id && i.vendor === vendor))[0];
    if(!nowPlayingSong){
      Alert.alert('下载出错～ 😯');
      return;
    } else {
      downloadOneSong(nowPlayingSong.vendor, nowPlayingSong.id, nowPlayingSong.album.id, nowPlayingSong, dispatch)
        .catch(e => {
          Alert.alert('下载出错～ 😯');
        });
    }
  }

  setupController(playing){
    MusicControl.setNowPlaying({
      title: this.state.name,
      artwork: this.state.cover, // URL or File path
      artist: this.state.artist,
      duration: parseInt(this.state.songLength), // (Seconds)
      playbackRate: playing ? 1 : 0
    });
    this.setupRemoteControl();
  }

  setupRemoteControl(){
    MusicControl.enableControl('play', true);
    MusicControl.enableControl('pause', true);
    MusicControl.enableControl('nextTrack', true);
    MusicControl.enableControl('previousTrack', false);
    MusicControl.enableControl('skipBackward', true, {interval: 15});
  }

  getSongInfoFromList(){
    const { songlist } = this.state;
    const { defaultSongID } = this.props;
    let song;
    if(songlist.length === 0){
      //if no song provided, just return
      return;
    }
    if(!defaultSongID){
      // if no defaultSongID provided, random
      song = songlist[Math.floor(Math.random()*songlist.length)];
    } else {
      song = songlist.filter(x => x.id === defaultSongID)[0];
      if(!song){
        Alert.alert('歌曲ID不在列表里...😯');
        return;
      }
    }
    this.setState({
      cover: song.album.coverBig || song.album.cover,
      name: song.name,
      artist: song.artist || song.artists.map(i => i.name).join(' & '),
      vendor: song.vendor,
      id: song.id,
    });
    if(song){
      this.getSongURL(song)
        .then(currentSong => {
          let nextSong = this.getNextSong();
          this.getNextSongURL(nextSong);
        })
        .catch(err => {
          Alert.alert(err.toString());
        });
    }
  }

  getSongURL(song){
    let { vendor, id } = song;
    let albumID = song.album.id;
    let tag = 0;
    if(vendor === 'xiami'){tag = 1}
    if(vendor === 'qq'){tag = 2}
    if(vendor === 'netease'){tag = 3}
    //this function will set the url state, which affect out audio player...
    return new Promise((resolve, reject) => {
      if(song.filePath){
        this.setState({
          url: song.filePath
        }, () => {
          resolve(song);
        });
      } else if(Object.keys(this.props.downloadedSong).indexOf(`${tag}${id}`) > -1){
        //check if the song has been downloaded
        this.setState({
          url: this.props.downloadedSong[`${tag}${id}`].filePath
        }, () => {
          resolve(song);
        });
      } else {
        api.getSongURL(vendor, id, albumID)
          .then(url => {
            this.setState({
              url,
            }, () => {
              resolve(song);
            });
          })
          .catch(err => {
            reject(err);
          });
      }
    });
  }

  PlayOrPause(){
    if(this.state.playing){
      this.props.changePlayStatus(2);
      this.setupController(false);
    } else {
      this.props.changePlayStatus(3);
      this.setupController(true)
    }
    this.setState({playing: !this.state.playing});
  }

  setSongPosition(e){
    if(!this.state.loaded){
      return;
    }
    this.audioPlayer.seek(e);
    this.isDragging = false;
  }

  onLoad(e){
    // set the duration of the song
    let duration = e.duration;
    this.setupController(this.state.playing);
    this.setState({
      songLength: duration
    });
  }

  setTime(e){
    if(!this.isDragging){
      this.setState({
        currentPosition: parseInt(e.currentTime),
      });
      MusicControl.setNowPlaying({
        title: this.state.name,
        artwork: this.state.cover, // URL or File path
        artist: this.state.artist,
        duration: parseInt(this.state.songLength), // (Seconds)
        elapsedPlaybackTime: parseInt(e.currentTime),
      })
    }
  }

  mute(e){
    this.setState({mute: !this.state.mute});
  }

  changeSwitchType(e){
    this.setState({random: !this.state.random});
  }

  getNextSong(){
    const { songlist } = this.state;
    let song;
    if(songlist.length === 1){
      return songlist[0];
    }
    if(this.state.random){
      //get an new list, like the original one but do not have just ended song.
      let newList = [...songlist].filter(x => x.id !== this.state.id);
      if(newList.length === 0){
        song = newList[0];
      } else {
        song = newList[Math.floor(Math.random()*newList.length)];
      }
    } else {
      //get next song in the list
      let currentIndex;
      for(let i = 0; i < songlist.length; i++){
        if(songlist[i].id === this.state.id){
          currentIndex = i;
        }
      }
      if(!currentIndex){
        //current playing song has been deleted from the list, just play the first one
        song = songlist[0];
      } else {
        if(currentIndex === songlist.length){
          //we get the end of the list, play the first one
          song = songlist[0];
        } else {
          song = songlist[currentIndex + 1];
        }
      }
    }
    return song;
  }

  getNextSongURL(song){
    let { vendor, id } = song;
    let albumID = song.album.id;
    let tag = 0;
    if(vendor === 'xiami'){tag = 1}
    if(vendor === 'qq'){tag = 2}
    if(vendor === 'netease'){tag = 3}
    if(song.filePath){
      this.setState({
        nextSong: {
          ...song,
          url: song.filePath
        },
        loaded: true,
      })
    } else if(Object.keys(this.props.downloadedSong).indexOf(`${tag}${id}`) > -1){
      //check if the song has been downloaded
      this.setState({
        nextSong: {
          ...song,
          url: this.props.downloadedSong[`${tag}${id}`].filePath
        },
        loaded: true,
      });
    } else {
      api.getSongURL(vendor, id, albumID)
        .then(url => {
          this.setState({
            nextSong: {
              ...song,
              url,
            },
            loaded: true,
          });
        })
        .catch(err => {
          Alert.alert('next song err T_T');
          if(err === 'err paring xml , please check xiami SDK'){
            this.onEnd();
          }
        });
    }
  }

  onEnd(){
    const { nextSong } = this.state;
    this.setState({
      songLength: 1,
      currentPosition: 0,
      cover: nextSong.album.coverBig || nextSong.album.cover,
      name: nextSong.name,
      artist: nextSong.artist || nextSong.artists.map(i => i.name).join(' & '),
      vendor: nextSong.vendor,
      id: nextSong.id,
    }, () => {
      let nextNextSong = this.getNextSong();
      this.getNextSongURL(nextNextSong);
    });
  }

  manuallySetNextSong(){
    const { nextSong } = this.state;
    if(nextSong.url === this.state.url){
      this.setState({
        url: null
      }, () => {
        this.setState({
          url: nextSong.url
        });
      });
    } else {
      this.setState({
        songLength: 1,
        currentPosition: 0,
        cover: nextSong.album.coverBig || nextSong.album.cover,
        name: nextSong.name,
        artist: nextSong.artist || nextSong.artists.map(i => i.name).join(' & '),
        vendor: nextSong.vendor,
        id: nextSong.id,
        url: nextSong.url,
      }, () => {
        let nextNextSong = this.getNextSong();
        this.getNextSongURL(nextNextSong);
      });
    }
  }

  onError(e){
    console.log(e);
    Alert.alert(JSON.stringify(e));
  }

  dragSlider(e){
    this.isDragging = true;
    this.setState({currentPosition: e});
  }

  convertTime(value){
    if(typeof(value) === 'string'){
      return value
    }
    let min = parseInt(value/60, 10);
    let sec = parseInt(value%60, 10);
    if(sec < 10){
      return `${min}:0${sec}`;
    } else {
      return `${min}:${sec}`;
    }
  }

  playNextSong(id, vendor){
    try{
      let nextSong = this.state.songlist.filter(i => (i.id === id && i.vendor === vendor))[0];
      let tag = 0;
      if(vendor === 'xiami'){tag = 1}
      if(vendor === 'qq'){tag = 2}
      if(vendor === 'netease'){tag = 3}
      LayoutAnimation.easeInEaseOut();
      if(Object.keys(this.props.downloadedSong).indexOf(`${tag}${nextSong.id}`) > -1){
        this.setState({
          songLength: 1,
          currentPosition: 0,
          cover: nextSong.album.coverBig || nextSong.album.cover,
          name: nextSong.name,
          artist: nextSong.artist || nextSong.artists.map(i => i.name).join(' & '),
          vendor: nextSong.vendor,
          id: nextSong.id,
          url: this.props.downloadedSong[`${tag}${id}`].filePath,
        }, () => {
          let nextNextSong = this.getNextSong();
          this.getNextSongURL(nextNextSong);
        })
      } else {
        api.getSongURL(nextSong.vendor, nextSong.id, nextSong.album.id)
          .then(url => {
            if(url === this.state.url){
              return;
            }
            this.setState({
              songLength: 1,
              currentPosition: 0,
              cover: nextSong.album.coverBig || nextSong.album.cover,
              name: nextSong.name,
              artist: nextSong.artist || nextSong.artists.map(i => i.name).join(' & '),
              vendor: nextSong.vendor,
              id: nextSong.id,
              url: url,
            }, () => {
              let nextNextSong = this.getNextSong();
              this.getNextSongURL(nextNextSong);
            })
          });
      }
    } catch(e){
      console.log(e);
      Alert.alert('出错啦～');
    }
  }

  handlePageChange(e){
    let offset = e.nativeEvent.contentOffset;
    LayoutAnimation.easeInEaseOut();
    if(offset) {
      var page = Math.round(offset.x / size.width) + 1;
      if(page === 1){
        this.setState({
          enableBackground: false
        });
      } else {
        this.setState({
          enableBackground: true
        });
      }
    }
  }

  render(){
    let video, downloaded, downloading, downloadingIcon;
    let { vendor, id } = this.state;
    let tag = 0;
    if(vendor === 'xiami'){tag = 1}
    if(vendor === 'qq'){tag = 2}
    if(vendor === 'netease'){tag = 3}
    if(Object.keys(this.props.downloadedSong).indexOf(`${tag}${id}`) > -1){
      //this song has been downloadedSong
      downloaded = true;
    } else {
      downloaded = false;
    }
    if(this.props.downloadingSong.filter(i => (i.id === id && i.vendor === vendor))[0]){
      downloading = true;
    }
    if(this.state.loaded && this.state.url && this.state.nextSong){
      video =   <Video
                  source={{uri: this.state.url, type: 'mp3'}}
                  nextSource={{uri: this.state.nextSong.url}}
                  ref={audio => this.audioPlayer = audio}
                  muted={this.state.mute}
                  paused={!this.state.playing}
                  onLoad={this.onLoad}
                  onProgress={this.setTime}
                  onEnd={this.onEnd}
                  onError={this.onError}
                  repeat={false}
                  playInBackground={true}
                  playWhenInactive={true}
                  progressUpdateInterval={1000}
                />
    }
    if(downloading){
      downloadingIcon = <ActivityIndicator size="small" />;
    } else if(downloaded){
      downloadingIcon = <Icon name="ios-cloud-download" style={[styles.icon, {color: oc.teal3}]} size={30} />;
    } else {
      downloadingIcon = <Icon name="ios-cloud-download-outline" style={styles.icon} size={30} />;
    }
    return(
      <Wapper style={{backgroundColor: oc.black}}>
        { video || null }
        <View style={styles.scrollIndicator}>
          <View style={{
            backgroundColor: this.state.enableBackground ? oc.gray8 : oc.gray5,
            height: 8, width: 8, borderRadius: 4, marginLeft: 5}}
          />
          <View style={{
            backgroundColor: this.state.enableBackground ? oc.gray5 : oc.gray8,
            height: 8, width: 8, borderRadius: 4, marginLeft: 5}}
          />
        </View>
        {
          this.state.enableBackground
          ? <Image source={{uri: this.state.cover}} resizeMode="cover" style={styles.blur}>
              <BlurView blurType="dark" blurAmount={40} style={styles.blur}>
              </BlurView>
            </Image>
          : null
        }
        <Navbar
          right={<Icon name="ios-arrow-down" size={28} color={oc.gray1} />}
          left={null}
          onRight={e => this.props.PlayerRouter.jumpBack()}
          backgroundColor='transparent'
        />
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal={true}
            onMomentumScrollEnd={this.handlePageChange}
            pagingEnabled={true}
            contentContainerStyle={{alignItems: 'center'}}
            showsHorizontalScrollIndicator={false}
          >
            {
              this.state.cover
              ? <View>
                  <Image
                    style={styles.image}
                    source={{uri: this.state.cover}}
                    resizeMode={'contain'}
                  />
                  <View style={styles.songName}>
                    <Text style={{color: oc.gray1, fontSize: 20, marginHorizontal: 20, backgroundColor: 'transparent'}} numberOfLines={1}>
                      {this.state.name}
                    </Text>
                    <Text style={{color: oc.gray1, fontSize: 16, marginTop: 10, backgroundColor: 'transparent'}} numberOfLines={1}>
                      {this.state.artist}
                    </Text>
                  </View>
                </View>
              : <View>
                  <View style={styles.image} />
                  <View style={styles.songName}>
                    <Text style={{color: oc.gray1, fontSize: 20, marginHorizontal: 20, backgroundColor: 'transparent'}} numberOfLines={1}>
                      {this.state.name}
                    </Text>
                    <Text style={{color: oc.gray1, fontSize: 16, marginTop: 10, backgroundColor: 'transparent'}} numberOfLines={1}>
                      {this.state.artist}
                    </Text>
                  </View>
                </View>
            }
            <NowList
              list={this.state.songlist}
              id={this.state.id}
              vendor={this.state.vendor}
              playing={this.state.playing}
              nextSong={this.playNextSong}
            />
          </ScrollView>
        </View>
        <View style={styles.slider}>
          <View style={styles.songPosition}>
            {
              this.state.loaded
              ? <Text style={{color: oc.gray1, backgroundColor: 'transparent'}}>
                  {this.convertTime(this.state.currentPosition)}
                </Text>
              : null
            }
          </View>
          <Slider
            maximumValue={this.state.songLength || 1}
            minimumValue={0}
            step={1}
            value={this.state.currentPosition}
            style={{width: width-100, height: 50}}
            onSlidingComplete={this.setSongPosition}
            onValueChange={this.dragSlider}
            minimumTrackTintColor={oc.teal3}
          />
          <View style={styles.songPosition}>
            {
              this.state.loaded && this.state.songLength !== 1
              ? <Text style={{color: oc.gray1, backgroundColor: 'transparent'}}>
                  {this.convertTime(this.state.songLength)}
                </Text>
              : null
            }
          </View>
        </View>
        <View style={styles.controlButton}>
          <TouchableOpacity style={styles.button} onPress={this.changeSwitchType}>
            {
              this.state.random
              ? <Icon name="ios-shuffle" style={styles.icon} size={28} />
              : <Icon name="ios-repeat" style={styles.icon} size={28} />
            }
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            disabled={downloaded ? true : false}
            onPress={this.downloadSong}
          >
            {downloadingIcon}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={this.PlayOrPause}
          >
            {
              this.state.playing
              ? <Icon name="ios-pause" style={styles.icon} size={50} />
              : <Icon name="ios-play" style={styles.icon} size={50} />
            }
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={e => this.manuallySetNextSong()}>
            <Icon name="ios-skip-forward" style={styles.icon} size={32} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.mute}>
            {
              this.state.mute
              ? <Icon name="ios-volume-off" style={styles.icon} size={28} />
              : <Icon name="ios-volume-up" style={styles.icon} size={28} />
            }
          </TouchableOpacity>
        </View>
      </Wapper>
    )
  }
}

Player.defaultProps = {
  //this id means user did what to trigger the player ?
  //no matter what situation is, if this props changes, reset the URL state to play new song.
  defaultSongID: '',
  //the only thing we care about of the playing list
  currentList: [],
  //whether to play the moment this scene is rendered
  playNow: false,
}

const styles = StyleSheet.create({
  header: {
    height: 64,
    width,
    alignItems: 'flex-start',
  },
  imageContainer: {
    height: (height - 64 - 10 - 60 - 100),
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: (height - 64 - 80 - 60 - 100) > (width - 40) ? (width - 40) : (height - 64 - 80 - 60 - 100),
    width: (height - 64 - 80 - 60 - 100) > (width - 40) ? (width - 40) : (height - 64 - 80 - 60 - 100),
    marginHorizontal: 20,
  },
  songName: {
    height: 70,
    width,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slider: {
    height: 70,
    width,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  songPosition: {
    height: 70,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    height: 120,
    width,
    padding: 20,
    paddingBottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    width: (width-40)/5,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: oc.gray1,
    backgroundColor: 'transparent',
  },
  audioStyle: {
    height: 0,
    width: 0,
  },
  backButton: {
    marginTop: 20,
    height: 44,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blur: {
    zIndex: -1,
    position: 'absolute',
    height: size.height,
    width: size.width,
    top: 0,
    left: 0,
  },
  scrollIndicator: {
    position: 'absolute',
    width: size.width,
    top: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    flexDirection: 'row',
  }
});

const mapStateToProps = (state) => {
  let currentList = state.playlist.filter(i => i.ident === 'current')[0];
  return {
    currentList: currentList.songs,
    defaultSongID: currentList.defaultSongID,
    downloadedSong: state.downloadedSong,
    downloadingSong: state.downloadingSong,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changePlayStatus: (playing) => {
      dispatch({type: 'CHANGE_PLAYING_STATUS', playing})
    },
    dispatch,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player)
