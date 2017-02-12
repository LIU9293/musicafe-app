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
      if(playlist){
        this.props.updatePlaylistFromStorage(JSON.parse(playlist));
      }
    } catch (e) {
      console.log(e);
      Alert.alert('async storage出错 😯');
    }
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
            <Discover navigator = {this.props.navigator} />
          </TabBarIOS.Item>
          <TabBarIOS.Item
            selected={this.state.tab === "search"}
            title={"search"}
            key="search"
            onPress={e => this.setState({tab: 'search'})}
            systemIcon={'search'}
          >
            <Search navigator = {this.props.navigator} />
          </TabBarIOS.Item>
          <TabBarIOS.Item
            selected={this.state.tab === "playlist"}
            title={"my music"}
            key="playlist"
            onPress={e => this.setState({tab: 'playlist'})}
            systemIcon={'bookmarks'}
          >
            <Playlist navigator = {this.props.navigator} />
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabView)
