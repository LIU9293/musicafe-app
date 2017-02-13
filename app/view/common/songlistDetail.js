/*
 * @providesModule SonglistDetail
 */
import React, { Component } from 'react';
import { View, Text, ScrollView, InteractionManager,
  Image, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import SongRowWithAction from 'SongRowWithAction';
import { size } from 'lib';
import api from 'api';
import Navbar from 'navbar';
import Wapper from 'wapper';
import oc from 'oc';
import Loading from 'Loading';

const GIF = require('../../assets/images/wave.gif');

class SonglistDetail extends Component{

  constructor(props){
    super(props);
    this.state = {
      loaded: false,
      listData: null,
    }
  }

  componentDidMount(){
    InteractionManager.runAfterInteractions(() => {
      api[`get${this.props.type}`](this.props.vendor, this.props.id)
        .then(res => {
          this.setState({listData: res, loaded: true});
        })
        .catch(err => {
          console.log(err);
        })
    })
  }

  render(){
    let lists;
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
            fromType={this.props.type}
            listData={this.state.listData.songList}
            PlayerRouter={this.props.PlayerRouter}
          />
        )
      })
    }
    return(
      <Wapper style={{backgroundColor: oc.black}}>
        <Navbar
          left={<Icon name="ios-arrow-back" size={24} style={{color: oc.gray1}} />}
          right={
            this.props.playing
            ? <Image source={GIF} style={{width: 15, height: 15}} />
            : null
          }
          onRight={(e) => {this.props.PlayerRouter.jumpForward()}}
          middle={<Text numberOfLines={1} style={{color: oc.gray1}}>{this.props.name}</Text>}
          onLeft={(e) => {this.props.navigator.pop()}}
        />
        <ScrollView style={styles.scroll}>
          <View style={styles.header}>
            <Image source={{uri: this.props.cover}} style={styles.cover}/>
            <View style={styles.description}>
              <View style={{marginLeft: 10}}>
                <Text style={{fontSize: 17, color: oc.gray1}}>{this.props.name}</Text>
                <Text style={{fontSize: 12, marginTop: 15,  color: oc.gray3}}>
                  {this.props.artist}
                </Text>
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
  },
  cover: {
    height: 150,
    width: 150,
  },
  description: {
    flex: 1,
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

const mapStateToProps = (state) => {
  return {
    playing: state.appStatus.playing
  }
}

export default connect(mapStateToProps)(SonglistDetail)
