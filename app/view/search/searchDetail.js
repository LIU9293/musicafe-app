/*
 * @providesModule SearchDetail
 */
import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import SearchDetailPage from 'SearchDetailPage';
import HeaderTabBar from 'HeaderTabBar';
import oc from 'oc';

class SearchDetail extends Component{

  render(){
   return(
     <ScrollableTabView
       renderTabBar={() => <HeaderTabBar needBack={true} navigator = {this.props.navigator} />}
       style={{paddingTop: 20, backgroundColor: oc.black}}
     >
       <SearchDetailPage
         tabLabel="虾米"
         vendor='xiami'
         type={this.props.type}
         searchKey={this.props.searchKey}
         navigator={this.props.navigator}
       />
       <SearchDetailPage
         tabLabel="QQ"
         vendor='qq'
         type={this.props.type}
         searchKey={this.props.searchKey}
         navigator={this.props.navigator}
       />
       <SearchDetailPage
         tabLabel="网易"
         vendor='netease'
         type={this.props.type}
         searchKey={this.props.searchKey}
         navigator={this.props.navigator}
       />
     </ScrollableTabView>
   )
  }

}

SearchDetail.defaultProps = {
  type: 'album',
  searchKey: '',
}

export default SearchDetail
