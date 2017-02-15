/*
 * @providesModule Playlist
 */
import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Navigator } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import UserPlaylist from './userPlaylist';
import UserDownload from './userDownload';
import HeaderTabBar from 'HeaderTabBar';
import oc from 'oc';
import Icon from 'react-native-vector-icons/Ionicons';
import { jumpForward } from 'lib';
import MusicIcon from 'MusicIcon';

class SearchDetail extends Component{

  constructor(props){
    super(props);
    this.jump = this.jump.bind(this);
  }

  jump(e){
    jumpForward(this.props.PlayerRouter);
  }

  render(){
   return(
     <ScrollableTabView
       renderTabBar={() => (
         <HeaderTabBar
           navigator = {this.props.navigator}
           right={
                   <TouchableOpacity style={styles.addButton} onPress={this.jump}>
                     <MusicIcon />
                   </TouchableOpacity>
                 }
         />
       )}
       style={{paddingTop: 20, backgroundColor: oc.black, marginBottom: 50}}
     >
       <UserPlaylist
         tabLabel="歌单"
         navigator={this.props.navigator}
         PlayerRouter={this.props.PlayerRouter}
       />
       <UserDownload
         tabLabel="下载"
         navigator={this.props.navigator}
         PlayerRouter={this.props.PlayerRouter}
       />
     </ScrollableTabView>
   )
  }

}

const styles = StyleSheet.create({
  addButton:{
    height: 50,
    position: 'absolute',
    right: 0,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default SearchDetail
