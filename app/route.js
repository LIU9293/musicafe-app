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
             PlayerRouter={this.props.PlayerRouter}
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
             PlayerRouter={this.props.PlayerRouter}
             type={route.type}
             searchKey={route.searchKey}
           />
         )
       case 'UserPlaylistDetail':
         return(
           <UserPlaylistDetail
             navigator={navigator}
             PlayerRouter={this.props.PlayerRouter}
             name={route.name}
             ident={route.listIdent}
           />
         )
       case 'AddPlaylist':
         return(
           <AddPlaylist
            navigator={navigator} 
            PlayerRouter={this.props.PlayerRouter}
          />
         )
       default:
         return(
           <TabView
            navigator={navigator}
            PlayerRouter={this.props.PlayerRouter}
           />
         );
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
