/*
 * @providesModule Player
 */

import React, { Component } from 'react';
import { View, Text, StyleSheet, Slider, TouchableOpacity, Image, Alert } from 'react-native';
import Video from 'react-native-video';
import oc from 'oc';
import api from 'api';
import Wapper from 'wapper';
import Icon from 'react-native-vector-icons/Ionicons';
import { size } from 'lib';
import { connect } from 'react-redux';
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

  componentWillMount(){
    this.setState({ songlist: this.props.currentList }, () => {
      this.getSongInfoFromList();
    });
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
      cover: song.album.cover || song.cover,
      name: song.name,
      artist: song.artist || song.artists.map(i => i.name).join(' & '),
      vendor: song.vendor,
      id: song.id,
    });
    if(song){
      this.getSongURL(song)
        .then(currentSong => {
          let nextSong = this.getNextSong();
          console.log('now state is : ', this.state);
          console.log('initial next song is : ', nextSong);
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
    //this function will set the url state, which affect out audio player...
    return new Promise((resolve, reject) => {
      api.getSongURL(vendor, id, albumID)
        .then(url => {
          console.log('initial play url is: ', url);
          this.setState({
            url,
          }, () => {
            resolve(song);
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  PlayOrPause(){
    this.setState({playing: !this.state.playing});
  }

  setSongPosition(e){
    if(!this.state.loaded){
      return;
    }
    this.isDragging = false;
    this.audioPlayer.seek(e);
  }

  onLoad(e){
    // set the duration of the song
    let duration = e.duration;
    this.setState({
      songLength: duration
    });
  }

  setTime(e){
    if(!this.isDragging){
      this.setState({currentPosition: parseInt(e.currentTime)});
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
    if(this.state.random){
      //get an new list, like the original one but do not have just ended song.
      let newList = [...songlist].filter(x => x.id !== this.state.id);
      song = newList[Math.floor(Math.random()*newList.length)];
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
    api.getSongURL(song.vendor, song.id, song.album.id)
      .then(url => {
        this.setState({
          nextSong: {
            ...song,
            url,
          },
          loaded: true,
        }, () => {
          console.log('after set the next song`s info, the state now is: ', this.state);
        });
      })
      .catch(err => {
        Alert.alert('next song err T_T');
        if(err === 'err paring xml , please check xiami SDK'){
          this.onEnd();
        }
      });
  }

  onEnd(){
    console.log('--- JS code --- the player on end ---');
    const { nextSong } = this.state;
    this.setState({
      loaded: false,
      songLength: 1,
      currentPosition: 0,
    }, () => {
      this.setState({
        cover: nextSong.album.cover || nextSong.cover,
        name: nextSong.name,
        artist: nextSong.artist || nextSong.artists.map(i => i.name).join(' & '),
        vendor: nextSong.vendor,
        id: nextSong.id,
        url: nextSong.url,
      }, () => {
        let nextNextSong = this.getNextSong();
        this.getNextSongURL(nextNextSong);
      });
    });
  }

  onError(e){
    Alert.alert(e);
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

  render(){
    let video;
    if(this.state.loaded && this.state.url && this.state.nextSong){
      video =   <Video
                  source={{uri: this.state.url}}
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
                />
    }
    return(
      <Wapper>
        { video || null }
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={e => this.props.navigator.jumpBack()}>
            <Icon name="ios-arrow-back" size={26} color={oc.gray1} />
          </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
          {
            this.state.cover
            ? <Image
                style={styles.image}
                source={{uri: this.state.cover}}
                resizeMode={'contain'}
              />
            : null
          }
        </View>
        <View style={styles.songName}>
          <Text style={{color: oc.gray1, fontSize: 20, marginHorizontal: 20}} numberOfLines={1}>
            {this.state.name}
          </Text>
          <Text style={{color: oc.gray1, fontSize: 16, marginTop: 10}} numberOfLines={1}>
            {this.state.artist}
          </Text>
        </View>
        <View style={styles.slider}>
          <View style={styles.songPosition}>
            {
              this.state.loaded
              ? <Text style={{color: oc.gray1}}>
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
              ? <Text style={{color: oc.gray1}}>
                  {this.convertTime(this.state.songLength)}
                </Text>
              : null
            }
          </View>
        </View>
        <View style={styles.controlButton}>
          <TouchableOpacity style={styles.button} onPress={this.changeSwitchType}>
            <Icon name="ios-shuffle" style={[styles.icon, {
                color: this.state.random ? oc.teal3 : 'white'
              }]} size={28} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Icon name="ios-skip-backward" style={styles.icon} size={34} />
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
          <TouchableOpacity style={styles.button} onPress={e => this.onEnd()}>
            <Icon name="ios-skip-forward" style={styles.icon} size={34} />
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
    height: (height - 64 - 80 - 60 - 100),
    width,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: (height - 64 - 80 - 60 - 100) > (width - 40) ? (width - 40) : (height - 64 - 80 - 60 - 100),
    width: (height - 64 - 80 - 60 - 100) > (width - 40) ? (width - 40) : (height - 64 - 80 - 60 - 100),
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
    color: oc.gray1
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
  }
});

const mapStateToProps = (state) => {
  let currentList = state.playlist.filter(i => i.ident === 'current')[0];
  return {
    currentList: currentList.songs,
    defaultSongID: currentList.defaultSongID,
  }
}

export default connect(mapStateToProps)(Player)