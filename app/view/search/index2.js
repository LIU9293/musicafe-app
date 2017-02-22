/*
 * @providesModule search2
 */

import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { Image, StyleSheet, StatusBar, Text, TextInput,
 TouchableWithoutFeedback, Animated, Easing, View,
 TouchableOpacity, Picker, ScrollView, Alert, AsyncStorage } from 'react-native';
import { size } from 'lib';
import Icon from 'react-native-vector-icons/Ionicons';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Wapper from 'wapper';
import oc from 'oc';
import api from 'api';
import MusicIcon from 'MusicIcon';
import { jumpForward } from 'lib';

class Search2 extends Component{
  constructor() {
    super();
    this.state = {
      scale: new Animated.Value(1),
      on: 0,
      scaleOn: 0,
      searchType: 'album',
      text: '',
      textInputFocus: false,
      suggestionData: [],
    }
    this.submit = this.submit.bind(this);
    this.jump = this.jump.bind(this);
    this.showSearchTextInput = this.showSearchTextInput.bind(this);
    this.hideSearchTextInput = this.hideSearchTextInput.bind(this);
    this.changeText = this.changeText.bind(this);
    this.searchSuggestion = this.searchSuggestion.bind(this);
    this.search = this.search.bind(this);
  }

  async componentWillMount(){
    try {
      let history = await AsyncStorage.getItem('searchHistory');
      if(history){
        this.props.updateSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.log(error);
    }
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

  search(text){
    this.setState({
      on: 0,
      scale: new Animated.Value(1),
      scaleOn: 0,
      text: '',
    });
    if(text === ''){
      Alert.alert('你都搜了什么...');
      return;
    }
    try {
      AsyncStorage.setItem('searchHistory', JSON.stringify(this.props.searchHistory.concat([text])));
    } catch (error) {
      console.log(error);
    }
    this.props.addSearchHistory(text);
    let route = {
      ident: 'SearchDetail',
      type: this.state.searchType,
      searchKey: text,
    };
    this.props.navigator.push(route);
  }

  submit(){
    this.setState({
      on: 0,
      scale: new Animated.Value(1),
      scaleOn: 0,
      text: '',
    })
    if(this.state.text === ''){
      Alert.alert(
        '请输入搜索内容🔍',
        '搜索内容不能为空哦~'
      )
      return;
    }
    try {
      AsyncStorage.setItem('searchHistory', JSON.stringify(this.props.searchHistory.concat([this.state.text])));
    } catch (error) {
      console.log(error);
    }
    this.props.addSearchHistory(this.state.text);
    let route = {
      ident: 'SearchDetail',
      type: this.state.searchType,
      searchKey: this.state.text,
    };
    this.props.navigator.push(route);
  }

  jump(e){
    jumpForward(this.props.PlayerRouter);
  }

  changeText(text){
    console.log(text);
    this.setState({text});
    if(text === ''){
      this.setState({
        suggestionData: []
      });
    } else {
      this.searchSuggestion(text);
    }
  }

  searchSuggestion(text){
    api.getSearchSuggestion(text)
      .then(res => {
        let suggestions = [];
        suggestions = suggestions.concat(res.album.itemlist.map(i => i.name))
                                 .concat(res.singer.itemlist.map(i => i.name))
                                 .concat(res.song.itemlist.map(i => i.name));
        this.setState({
          suggestionData: suggestions
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    let suggestions, historys;
    if(this.state.suggestionData.length > 0){
      suggestions = this.state.suggestionData.map((i, index) => {
        return(
          <TouchableOpacity style={styles.row} key={index+1} onPress={e => this.search(i.toString())}>
            <Text
              style={{color: oc.white}}
              numberOfLines={1}
            >
              {i.toString()}
            </Text>
          </TouchableOpacity>
        )
      });
      suggestions.unshift(
        <View key={0} style={{marginHorizontal: 20, marginVertical: 5}}>
          <Text style={{color: oc.gray2, marginVertical: 5}}>{`热门搜索: `}</Text>
        </View>
      )
    }
    if(this.props.searchHistory && this.props.searchHistory.length > 0){
      historys = this.props.searchHistory.map((i, index) => {
        return(
          <TouchableOpacity style={styles.row} key={index+1} onPress={e => this.search(i.toString())}>
            <Text
              style={{color: oc.white}}
              numberOfLines={1}
            >
              {i.toString()}
            </Text>
          </TouchableOpacity>
        )
      });
      historys.unshift(
        <View key={0} style={{marginHorizontal: 20, marginVertical: 5}}>
          <Text style={{color: oc.gray2, marginVertical: 5}}>{`历史搜索: `}</Text>
        </View>
      );
    }
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
                <Picker.Item label="歌曲" value="song" />
                <Picker.Item label="专辑" value="album" />
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
                  onChangeText={this.changeText}
                  value={this.state.text}
                  autoFocus={true}
                  onSubmitEditing={this.submit}
                  placeholder={'请输入搜索内容...'}
                  placeholderTextColor={oc.gray5}
                  returnKeyType={'search'}
                />
                <View
                  style={{height: 1, width: 100, backgroundColor: oc.gray5, marginBottom: 5, marginLeft: 20}}
                />
                {
                  this.state.text.length > 0
                  ? suggestions
                  : historys
                }
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
    marginBottom: 10,
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
    marginBottom: 5,
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
  },
  row: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  }
});

const mapStateToProps = (state) => {
  return {
    searchHistory: state.searchHistory
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addSearchHistory: (key) => {
      dispatch({type: 'SEARCH_KEY_PUSH_ONE', key});
    },
    updateSearchHistory: (history) => {
      dispatch({type: 'SEARCH_KEY_UPDATE', history})
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search2)
