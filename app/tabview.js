/*
 * @providesModule TabView
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, TabBarIOS, StatusBar, AsyncStorage, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Discover from 'discover';
import Search from 'search';
import Playlist from 'Playlist';
import oc from 'oc';
const RNFS = require('react-native-fs');
const root = `${RNFS.DocumentDirectoryPath}/musicafe/`;

class TabView extends Component{
  constructor(props){
    super(props);
    this.state = {
      tab: 'home'
    }
  }

  async componentWillMount(){
    try {
      let playlist = await AsyncStorage.getItem('playlist');
      let asyncDataString = await AsyncStorage.getItem('download');
      let folderData = await RNFS.readDir(root);
      if(playlist){
        this.props.updatePlaylistFromStorage(JSON.parse(playlist));
      }
      if(folderData && folderData.length > 0){
        let verifiedDownloadData = this.verifyDownloadData(JSON.parse(asyncDataString), folderData);
        this.props.updateDownloadDataStorage(verifiedDownloadData);
      }
    } catch (e) {
      console.log(e);
      Alert.alert('存储出错 😯');
    }
  }

  verifyDownloadData(asyncData, folderData){
    let allFolderSongNames = [...folderData].map(i => i.name);
    let verifiedDataArray = allFolderSongNames.map((fileName, index) => {
      if(asyncData[fileName.split('.')[0]]){
        return {
          ...asyncData[fileName.split('.')[0]],
          filePath: 'file://' + folderData.filter(i => i.name === fileName)[0].path
        }
      } else {
        return -1;
      }
    });
    verifiedDataArray = verifiedDataArray.filter(i => i !== -1);
    let newObj = {};
    for(let i=0; i<verifiedDataArray.length; i++){
      let key = verifiedDataArray[i].fileName.split('.')[0];
      newObj[key] = verifiedDataArray[i];
    }
    return newObj;
  }

  render(){
    return(
      <View style={{flex:1}}>
        <StatusBar
          showHideTransition={'fade'}
          animated={true}
          barStyle={this.props.barStyle}
        />
        <TabBarIOS
          tintColor={oc.gray0}
          unselectedTintColor={oc.gray5}
          translucent={false}
          barTintColor={oc.black}
        >
          <TabBarIOS.Item
            selected={this.state.tab === "home"}
            title={"home"}
            key="home"
            onPress={e => this.setState({tab: 'home'})}
            systemIcon={'featured'}
          >
            <Discover navigator = {this.props.navigator} PlayerRouter={this.props.PlayerRouter} />
          </TabBarIOS.Item>
          <TabBarIOS.Item
            selected={this.state.tab === "search"}
            title={"search"}
            key="search"
            onPress={e => this.setState({tab: 'search'})}
            systemIcon={'search'}
          >
            <Search navigator = {this.props.navigator} PlayerRouter={this.props.PlayerRouter} />
          </TabBarIOS.Item>
          <TabBarIOS.Item
            selected={this.state.tab === "playlist"}
            title={"my music"}
            key="playlist"
            onPress={e => this.setState({tab: 'playlist'})}
            systemIcon={'bookmarks'}
          >
            <Playlist navigator = {this.props.navigator} PlayerRouter={this.props.PlayerRouter} />
          </TabBarIOS.Item>
        </TabBarIOS>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return{
    barStyle: state.appStatus.barStyle,
  }
}

const mapDispatchToProps =(dispatch) => {
  return{
    updatePlaylistFromStorage: (playlist) => {
      dispatch({type: 'INIT_PLAYLIST', playlist});
    },
    updateDownloadDataStorage: (data) => {
      dispatch({type: 'INIT_DOWNLOADED_SONG', data});
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabView)
