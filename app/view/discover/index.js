/*
 * @providesModule discover
 */

import React, { Component } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
const { BlurView } = require('react-native-blur');
import oc from 'oc';
import Wapper from 'wapper';
import Loading from 'Loading';
import MusicIcon from 'MusicIcon';
import { jumpForward, shuffle } from 'lib';
import refetch from 're-fetch';
import { getSugggestAlbum } from 'api';

class Discover extends Component{
  constructor(props){
    super(props);
    this.state = {
      album: null,
      playlist: null,
      suggestion:  null,
      loaded: false,
      fetchErr: null,
    }
  }

  componentWillMount(){
    this.fetchData();
  }

  fetchData = () => {
    this.setState({fetchErr: null}, () => {
      Promise.all([
        getSugggestAlbum(),
        this.getEditorChoice()
      ])
        .then(res => {
          const { xiami, qq } = res[0];
          const { album, playlist } = res[1];
          const xiamiSuggestion = xiami.albumList.map(item => ({
            ...item,
            vendor: 'xiami'
          }));
          const qqSuggestion = qq.albumList.map(item => ({
            ...item,
            vendor: 'qq'
          }))
          this.setState({
            album,
            playlist,
            suggestion: shuffle([...xiamiSuggestion, ...qqSuggestion]),
            loaded: true
          })
        })
    })
  }

  getEditorChoice = () => {
    return new Promise((resolve, reject) => {
      refetch('https://raw.githubusercontent.com/LIU9293/musicAPI/master/test/suggestion.json', {}, 4000, 2)
        .then(res => res.json())
        .then(json => resolve(json))
        .catch(err => reject(err));
    });
  }

  JumpToPlayer = () => {
    jumpForward(this.props.PlayerRouter);
  }

  pushToDetail = (props) => {
    this.props.navigator.push({
      ...props,
      ident: 'SonglistDetail',
    });
  }

  render(){
    if(this.state.fetchErr){
      return(
        <Wapper style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: oc.white}}>{this.state.fetchErr}</Text>
          <TouchableOpacity onPress={this.fetchData} style={styles.reloadButton}>
            <Text style={{color: oc.white}}>重新加载</Text>
          </TouchableOpacity>
        </Wapper>
      )
    }
    if(this.state.loaded){
      let albumList = this.state.album.map((item, index) => {
        return (
          <TouchableOpacity
            key={item.id}
            style={[styles.album, {marginLeft: index === 0 ? 20 : 0}]}
            onPress={e => this.pushToDetail({
              cover: item.cover,
              name: item.name,
              artist: item.artist,
              vendor: item.vendor,
              id: item.id,
              type: 'album',
            })}
          >
            <Image source={{uri: item.cover}} style={{width: 160, height: 160}} />
            <Image source={{uri: item.cover}} style={styles.nameArea}>
              <BlurView blurType="dark" blurAmount={20} style={styles.blur}>
                <Text style={styles.albumName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.artist} numberOfLines={1}>{item.artist}</Text>
              </BlurView>
            </Image>
          </TouchableOpacity>
        )
      });
      let playlists = this.state.playlist.map((item, index) => {
        return (
          <TouchableOpacity
            key={item.id}
            style={[styles.album, {marginLeft: index === 0 ? 20 : 0}]}
            onPress={e => this.pushToDetail({
              cover: item.cover,
              name: item.name,
              artist: item.author,
              vendor: item.vendor,
              id: item.id,
              type: 'playlist',
            })}
          >
            <Image source={{uri: item.cover}} style={{width: 160, height: 160}} />
            <Image source={{uri: item.cover}} style={styles.nameArea}>
              <BlurView blurType="dark" blurAmount={20} style={styles.blur}>
                <Text style={styles.albumName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.artist} numberOfLines={1}>{item.author}</Text>
              </BlurView>
            </Image>
          </TouchableOpacity>
        )
      });
      let suggestionList = this.state.suggestion.map((item, index) => {
        return (
          <TouchableOpacity
            key={item.id}
            style={[styles.album, {marginLeft: index === 0 ? 20 : 0}]}
            onPress={e => this.pushToDetail({
              cover: item.cover,
              name: item.name,
              artist: item.artist.name,
              vendor: item.vendor,
              id: item.id,
              type: 'album',
            })}
          >
            <Image source={{uri: item.cover}} style={{width: 160, height: 160}} />
            <Image source={{uri: item.cover}} style={styles.nameArea}>
              <BlurView blurType="dark" blurAmount={20} style={styles.blur}>
                <Text style={styles.albumName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.artist} numberOfLines={1}>{item.artist.name}</Text>
              </BlurView>
            </Image>
          </TouchableOpacity>
        )
      })
      return(
        <Wapper style={{backgroundColor: oc.black, paddingBottom: 50}}>
          <ScrollView style={{flex: 1, backgroundColor: oc.black}}>
            <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'flex-end'}}>
              <Text style={styles.title}>推荐专辑</Text>
              <TouchableOpacity onPress={this.JumpToPlayer} style={styles.musicIcon}>
                <MusicIcon />
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {suggestionList}
            </ScrollView>
            <Text style={[styles.title, {marginTop: 30}]}>编辑精选</Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {shuffle(albumList.concat(playlists))}
            </ScrollView>
          </ScrollView>
        </Wapper>
      )
    }
    return(
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: oc.black}}>
        <Loading />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  album: {
    height: 230,
    width: 160,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 30,
    color: oc.gray2,
    marginTop:40,
    marginBottom: 20,
    marginLeft:20,
    fontWeight:'bold'
  },
  nameArea: {
    width: 160,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: oc.gray2,
  },
  blur: {
    width: 160,
    height: 60,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumName: {
    color: oc.gray1,
  },
  artist: {
    color: oc.gray2,
    marginTop: 3,
  },
  musicIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reloadButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 36,
    width: 100,
    borderColor: oc.white,
    borderWidth: 1,
    borderRadius: 3,
    marginTop: 30,
  }
})

export default Discover
