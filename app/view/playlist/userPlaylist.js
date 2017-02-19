import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Navigator } from 'react-native';
import Wapper from 'wapper';
import { connect } from 'react-redux';
import Parallax from 'react-native-parallax';
import oc from 'oc';
import { size } from 'lib';
import Icon from 'react-native-vector-icons/Ionicons';
const { BlurView } = require('react-native-blur');

class UserPlaylist extends Component{

  constructor(props){
    super(props);
    this.renderList = this.renderList.bind(this);
    this.pushNext = this.pushNext.bind(this);
    this.addList = this.addList.bind(this);
  }

  pushNext(list){
    this.props.navigator.push({
      ident: 'UserPlaylistDetail',
      listIdent: list.ident,
      name: list.name,
    });
  }

  addList(){
    this.props.navigator.push({
      ident: 'AddPlaylist',
      sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
    });
  }

  renderList(){
    const { playlist } = this.props;
    let lists = playlist.map((list,index) => {
      if(list.ident === 'current'){
        return null;
      }
      let cover;
      if(list.songs.length > 0){
        let randomSong = list.songs[Math.floor(Math.random()*list.songs.length)];
        cover = {uri: randomSong.album.cover || randomSong.cover}
      } else {
        cover = require('../../assets/images/guitar.jpg');
      }
      return(
        <Parallax.Image
          key={index}
          style={{ height: 160, marginBottom: 2 }}
          overlayStyle={{ backgroundColor: 'transparent'}}
          source={ cover }
        >
          <BlurView blurType="dark" blurAmount={20} style={styles.blur}>
            <TouchableOpacity style={styles.blur} onPress={e => this.pushNext(list)}>
              <Text style={styles.text}>{list.name}</Text>
            </TouchableOpacity>
          </BlurView>
        </Parallax.Image>
      )
    });
    lists = lists.filter(i => {if(i){return i}});
    return lists;
  }

  render(){
    let lists = this.renderList();
    lists.push(
      <TouchableOpacity key={'add'} onPress={this.addList} style={styles.addListButton}>
        <Icon name="ios-add" size={40} color={oc.gray1} />
      </TouchableOpacity>
    )
    return(
      <Wapper>
        <Parallax.ScrollView>
          {lists}
        </Parallax.ScrollView>
      </Wapper>
    )
  }
}

const styles = StyleSheet.create({
  blur: {
    width: size.width,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: oc.gray1,
    fontSize: 20,
    marginHorizontal: 30,
  },
  addListButton: {
    height: 160,
    width: size.width,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

const mapStateToProps = (state) => {
  return{
    playlist: state.playlist
  }
}

export default connect(mapStateToProps)(UserPlaylist)
