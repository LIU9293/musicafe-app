/*
 * @providesModule AddPlaylist
 */

import React, { Component } from 'react'
import { View, Text, StyleSheet, TextInput, Alert, AsyncStorage } from 'react-native';
import Wapper from 'wapper';
import oc from 'oc';
import Navbar from 'navbar';
import { connect } from 'react-redux';

class AddPlaylist extends Component{

  constructor(props){
    super(props);
    this.state = {
      text: '',
    };
  }

  addList = () => {
    if(this.state.text === ''){
      Alert.alert('歌单名不能为空哦~😯');
      return
    }
    this.props.addPlaylist(this.state.text);
    try {
      AsyncStorage.setItem('playlist', JSON.stringify(this.props.playlist));
    } catch (error) {
      console.log(error);
      Alert.alert('出了点问题，请稍后再添加~😯');
    }
    this.props.navigator.pop();
  }

  render(){
    return(
      <Wapper>
        <Navbar
          left={<Text style={{color: oc.gray1}}>取消</Text>}
          onLeft={e => this.props.navigator.pop()}
          middle={<Text numberOfLines={1} style={{color: oc.gray1}}>新建歌单</Text>}
          right={<Text style={{color: oc.gray1}}>完成</Text>}
          onRight={e => this.addList()}
        />
        <TextInput
          style={{height: 40, backgroundColor: oc.gray8, marginTop: 10, paddingHorizontal: 10, color: oc.gray1}}
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
          autoFocus={true}
          onSubmitEditing={this.addList}
        />
      </Wapper>
    )
  }
}

const mapStateToProps = (state) => {
  return{
    playlist: state.playlist
  }
}

const mapDispatchToProps = (dispatch) => {
  return{
    addPlaylist: (name) => {
      dispatch({type: 'CREATE_PLAYLIST', name, ident: new Date().getTime().toString()});
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddPlaylist)
