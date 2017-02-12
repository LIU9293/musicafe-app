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

class SearchDetail extends Component{

  constructor(props){
    super(props);
    this.addList = this.addList.bind(this);
  }

  addList(){
    this.props.navigator.push({
      ident: 'AddPlaylist',
      sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
    });
  }

  render(){
   return(
     <ScrollableTabView
       renderTabBar={() => (
         <HeaderTabBar
           navigator = {this.props.navigator}
           right={
                   <TouchableOpacity style={styles.addButton} onPress={this.addList}>
                     <Icon name="ios-add" size={30} color={oc.gray1} />
                   </TouchableOpacity>
                 }
         />
       )}
       style={{paddingTop: 20, backgroundColor: oc.black}}
     >
       <UserPlaylist
         tabLabel="歌单"
         navigator={this.props.navigator}
       />
       <UserDownload
         tabLabel="下载"
         navigator={this.props.navigator}
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
