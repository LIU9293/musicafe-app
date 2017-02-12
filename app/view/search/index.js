/*
 * @providesModule search
 */
import React, { Component } from 'react';
import oc from 'oc';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import Wapper from 'wapper';
import { Kohana } from 'react-native-textinput-effects';
import Icon from 'react-native-vector-icons/Ionicons';
import Ratio from 'ratio';

class Search extends Component{

  constructor(props){
    super(props);
    this.state = {
      song: true,
      album: false,
      playlist: false,
      key: '',
    };
    this.changeSearchType = this.changeSearchType.bind(this);
    this.changeText = this.changeText.bind(this);
    this.submit = this.submit.bind(this);
  }

  changeSearchType(type){
    this.setState({
      song: type === 'song' ? true : false,
      album: type === 'album' ? true : false,
      playlist: type === 'playlist' ? true : false,
    })
  }

  changeText(e){
    this.setState({key: e});
  }

  submit(){
    if(this.state.key === ''){
      Alert.alert(
        '请输入搜索内容🔍',
        '搜索内容不能为空哦~'
      )
      return;
    }
    let type;
    if(this.state.song){type = 'song'}
    if(this.state.album){type = 'album'}
    if(this.state.playlist){type = 'playlist'}
    let route = {
      ident: 'SearchDetail',
      type,
      searchKey: this.state.key,
    };
    this.props.navigator.push(route);
  }

  render(){
    return(
      <ScrollView
        keyboardDismissMode='on-drag'
        showsVerticalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.contentStyle}
      >
        <View style={styles.textInput}>
          <Kohana
            onSubmitEditing={this.submit}
            returnKeyType={'search'}
            blurOnSubmit={true}
            onChangeText={this.changeText}
            style={{backgroundColor: 'transparent'}}
            label={'你想听什么？'}
            iconClass={Icon}
            iconName={'ios-musical-note'}
            iconColor={oc.gray1}
            labelStyle={{ color: oc.gray1 }}
            inputStyle={{ color: oc.gray1 }}
          />
        </View>
        <Ratio
          onPress={e => this.changeSearchType('song')}
          checked={this.state.song}
          style={{marginTop: 30}}
          text={'song'}
        />
        <Ratio
          onPress={e => this.changeSearchType('album')}
          checked={this.state.album}
          style={{marginTop: 30}}
          text={'album'}
        />
        <Ratio
          onPress={e => this.changeSearchType('playlist')}
          checked={this.state.playlist}
          style={{marginTop: 30}}
          text={'playlist'}
        />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: oc.black,
    flexDirection: 'column',
  },
  contentStyle: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textInput: {
    backgroundColor: 'transparent',
    height: 60,
    width: 250,
    borderBottomWidth: 0.5,
    borderBottomColor: oc.gray1,
    marginTop: 100,
  }
})

export default Search
