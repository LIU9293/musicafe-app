/*
 * @providesModule PlayerRouter
 */
 import React, { Component, } from 'react';
 import Player from 'Player';
 import { Navigator } from 'react-native';
 import MainRoute from 'route';

 class PlayerRouter extends Component{
   constructor(props){
     super(props);
     this.renderScene = this.renderScene.bind(this);
   }
   renderScene(route, navigator){
     switch (route.ident) {
       case 'Player':
         console.log(route);
         return(
           <Player
             PlayerRouter={navigator}
             defaultSongID={route.defaultSongID}
             playNow={route.playNow}
           />
         )
       default:
         return <MainRoute PlayerRouter = {navigator} />;
     }
   }
   render(){
     return(
       <Navigator
         initialRoute = {{}}
         ref = {nav => this.navigator = nav}
         renderScene = {this.renderScene}
         configureScene ={(route, routeStack) => ({...route.sceneConfig || Navigator.SceneConfigs.FloatFromBottom})}
       />
     )
   }
 }

 export default PlayerRouter
