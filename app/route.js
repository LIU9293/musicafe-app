/*
 * @providesModule route
 */
import React, { Component, } from 'react';
import { Navigator, Text } from 'react-native';
import TabView from 'TabView';
import SonglistDetail from 'SonglistDetail';
import SearchDetail from 'SearchDetail';
import UserPlaylistDetail from 'UserPlaylistDetail';
import AddPlaylist from 'AddPlaylist';
import Player from 'Player';

 class Route extends Component{
   constructor(props){
     super(props);
     this.renderScene = this.renderScene.bind(this);
   }

   renderScene(route, navigator){
     switch (route.ident){
       case 'SonglistDetail':
         return(
           <SonglistDetail
             navigator={navigator}
             id={route.id}
             vendor={route.vendor}
             cover={route.cover}
             name={route.name}
             artist={route.artist}
             type={route.type}
           />
       );
       case 'SearchDetail':
         return(
           <SearchDetail
             navigator={navigator}
             type={route.type}
             searchKey={route.searchKey}
           />
         )
       case 'UserPlaylistDetail':
         return(
           <UserPlaylistDetail
             navigator={navigator}
             name={route.name}
             ident={route.listIdent}
           />
         )
       case 'AddPlaylist':
         return(
           <AddPlaylist navigator = {navigator} />
         )
       case 'Player':
         return(
           <Player
             navigator={navigator}
             defaultSongID={route.defaultSongID}
             playNow={route.playNow}
           />
         )
       default:
         return <TabView navigator = {navigator} />;
     }
   }

   render(){
     return (
       <Navigator
         initialRoute = {{}}
         ref = {nav => this.navigator = nav}
         renderScene = {this.renderScene}
         configureScene ={(route, routeStack) => ({...route.sceneConfig || Navigator.SceneConfigs.PushFromRight})}
       />
     )
   }

 }

 export default Route
