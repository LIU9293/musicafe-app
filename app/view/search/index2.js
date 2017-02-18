/*
 * @providesModule search2
 */

import React,{ Component } from 'react';
import { Image, StyleSheet, StatusBar, Text, TextInput,
 TouchableWithoutFeedback, Animated, Easing, View,
 TouchableOpacity, Picker, ScrollView } from 'react-native';
import { size } from 'lib';
import Icon from 'react-native-vector-icons/Ionicons';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Wapper from 'wapper';
import oc from 'oc';
import MusicIcon from 'MusicIcon';
import { jumpForward } from 'lib';

export default class extends Component{
  constructor() {
    super();
    this.state = {
      scale: new Animated.Value(1),
      on: 0,
      scaleOn: 0,
      searchType: 'album',
      text: '',
      textInputFocus: false,
    }
    this.submit = this.submit.bind(this);
    this.jump = this.jump.bind(this);
    this.showSearchTextInput = this.showSearchTextInput.bind(this);
    this.hideSearchTextInput = this.hideSearchTextInput.bind(this);
  }

  showSearchTextInput() {
    this.setState({
      on:1,
    });
    Animated.timing(
       this.state.scale,
       {
         toValue: 20,
         duration: 200,
         easing: Easing.elastic(1),
       },
    ).start(() => {
      this.setState({
        scaleOn:1,
      });
    });
  }

  hideSearchTextInput() {
    this.setState({
      text: '',
      scaleOn:0,
    });
    Animated.timing(
       this.state.scale,
       {
         toValue: 1,
         duration: 200,
         easing: Easing.elastic(1),
       },
    ).start(() => {
      this.setState({
        on:0,
      });
    });
  }

  submit(){
    this.setState({
      on: 0,
      scale: new Animated.Value(1),
      scaleOn: 0,
    })
    if(this.state.text === ''){
      Alert.alert(
        '请输入搜索内容🔍',
        '搜索内容不能为空哦~'
      )
      return;
    }
    let route = {
      ident: 'SearchDetail',
      type: this.state.searchType,
      searchKey: this.state.text,
    };
    console.log(route);
    this.props.navigator.push(route);
  }

  jump(e){
    jumpForward(this.props.PlayerRouter);
  }

  render() {
    return(
      <Wapper style={{marginBottom: this.state.textInputFocus ? 0 : 50}}>
        {
          this.state.scaleOn === 0
          ?
          <View style={styles.content}>
            <TouchableOpacity onPress={this.jump} style={styles.musicIcon}>
              <MusicIcon />
            </TouchableOpacity>
            <View style={{alignItems: 'center', marginBottom: 50}}>
              <Picker
                style={{width: size.width}}
                itemStyle={{color: oc.white}}
                selectedValue={this.state.searchType}
                onValueChange={(type) => this.setState({searchType: type})}
              >
                <Picker.Item label="专辑" value="album" />
                <Picker.Item label="歌曲" value="song" />
                <Picker.Item label="歌单" value="playlist" />
              </Picker>
            </View>
            <View style={styles.btn}>
              <TouchableOpacity onPress={this.showSearchTextInput}>
                <Animated.View style={[styles.btnContent,{transform:[{scale:this.state.scale}]}]}>
                  {
                    this.state.on
                    ?  null
                    :  <Text style={{color: oc.white, fontSize: 18}}>{'搜索'}</Text>
                  }
                </Animated.View>
              </TouchableOpacity>
            </View>
          </View>
          : null
        }
        {
          this.state.scaleOn === 1
          ? <View style={styles.scaleOnContainer}>
              <ScrollView
                style={styles.scrollContainer}
                keyboardDismissMode='on-drag'
                showsVerticalScrollIndicator={false}
                onBlur={e => this.setState({textInputFocus: false})}
                onFocus={e => this.setState({textInputFocus: true})}
              >
                <Text style={styles.scaleText}>{'你想听什么？'}</Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(text) => this.setState({text})}
                  value={this.state.text}
                  autoFocus={true}
                  onSubmitEditing={this.submit}
                  placeholder={'请输入搜索内容...'}
                  placeholderTextColor={oc.gray5}
                  returnKeyType={'search'}
                />
              </ScrollView>
              <View style={{height: 50, width: size.width, justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity
                  style={[styles.btnContent, {backgroundColor:oc.teal6}]}
                  onPress={this.submit}
                >
                  <Text style={{color: oc.white, fontSize: 18}}>{'搜索'}</Text>
                </TouchableOpacity>
              </View>
              <View style={{height: 50, width: size.width, marginLeft: 5}}>
                <TouchableOpacity style={styles.close} onPress={this.hideSearchTextInput}>
                  <Icon name="ios-close" color={oc.gray1} size={30}/>
                </TouchableOpacity>
              </View>
              <KeyboardSpacer />
            </View>
          : null
        }
      </Wapper>
    )
  }
}

const styles = StyleSheet.create({
  content:{
    flex: 1,
    paddingTop: 120,
  },
  picker: {
    width:size.width,
    alignItems:"center",
    justifyContent:"center",
    backgroundColor: 'transparent',
  },
  pickerItemstyle: {
    color: oc.white,
    backgroundColor: oc.gray1,
  },
  btn:{
    width:size.width,
    alignItems:"center",
    justifyContent:"center",
  },
  btnContent:{
    width:250,
    height:50,
    borderRadius:25,
    backgroundColor:oc.gray8,
    alignItems:"center",
    justifyContent:"center",
  },
  scaleText:{
    color:oc.gray1,
    fontSize:25,
    paddingLeft:20,
    paddingTop:50,
    backgroundColor:oc.gray8,
  },
  scrollContainer:{
    flex: 1,
    backgroundColor: oc.gray8,
  },
  scaleOnContainer: {
    flex: 1,
    backgroundColor: oc.gray8,
  },
  close: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    height: 40,
    marginTop: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    color: oc.gray1,
    borderBottomWidth: 1,
    borderBottomColor: oc.gray1,
  },
  musicIcon: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 20,
    right: 0,
    zIndex: 999,
  }
});
