/*
 * @providesModule SearchDetailPage
 */
 import React, { Component } from 'react'
 import { View, Text, StyleSheet, ListView, Image, TouchableOpacity } from 'react-native';
 import api from 'api';
 import Wapper from 'wapper';
 import { size } from 'lib';
 import oc from 'oc';
 import SongRowWithAction from 'SongRowWithAction';

 class SearchDetailPage extends Component{
   constructor(props){
     super(props);
     const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
     this.state = {
       data: [],
       loaded: false,
       page: 1,
       total: 0,
       dataSource: ds.cloneWithRows([]),
     }
     this.searchData = this.searchData.bind(this);
     this.renderRow = this.renderRow.bind(this);
     this.loadMore = this.loadMore.bind(this);
     this.renderFooter = this.renderFooter.bind(this);
     this.pushNext = this.pushNext.bind(this);
   }

   componentDidMount(){
     this.searchData(15, this.state.page);
   }

   searchData(limit, page){
     const { type, vendor, searchKey } = this.props;
     api[`search${type}`](vendor, searchKey, limit, page)
      .then(res => {
        if(res.success){
          let data;
          switch (type) {
            case 'song':
              data = res.songList;
              break;
            case 'album':
              data = res.albumList;
              break;
            case 'playlist':
              data = res.playlists;
              break;
            default:
              break;
          }
          this.setState({
            total: res.total,
            data: this.state.data.concat(data),
            loaded: true,
            dataSource: this.state.dataSource.cloneWithRows(this.state.data.concat(data)),
            page: this.state.page+1,
          })
        } else {
          throw res.message;
        }
      })
      .catch(err => {
        console.log(err);
      })
   }

   renderRow(rowData, sectionID, rowID){
     const { type, vendor } = this.props;
     let cover = (type === 'song') ? rowData.album.cover : rowData.cover;
     if(type === 'song'){
       return(
         <SongRowWithAction
           songData={rowData}
           index={parseInt(rowID)}
           name={rowData.name}
           id={rowData.id}
           needPay={rowData.needPay}
           offline={rowData.offline || false}
           vendor={vendor}
           albumID={rowData.album.id}
           cover={rowData.album.cover}
           fromType={'song'}
         />
       )
     }
     return(
       <View style={styles.row}>
         <TouchableOpacity style={styles.rowLeft} onPress={e => this.pushNext(rowData)}>
           <Image source={{uri: cover}} style={styles.cover} />
           <Text style={{color: oc.gray1, marginHorizontal: 15}} numberOfLines={2}>
             {rowData.name}
           </Text>
         </TouchableOpacity>
         <View>
         </View>
       </View>
     )
   }

   pushNext(rowData){
     const { type } = this.props;
     if(type !== 'song'){
       this.props.navigator.push({
         cover: rowData.cover,
         name: rowData.name,
         artist: type === 'album' ? rowData.artist.name : rowData.author.name,
         vendor: this.props.vendor,
         id: rowData.id,
         type,
         ident: 'SonglistDetail'
       });
     }
   }

   loadMore(){
     if(this.state.data.length < this.state.total){
       this.searchData(15, this.state.page);
     }
   }

   renderFooter(){
     if(this.state.data.length < this.state.total){
       return(
         <View style={styles.footer}>
           <Text style={styles.footerText}>正在加载更多...</Text>
         </View>
       )
     } else {
       return(
         <View style={styles.footer}>
           <Text style={styles.footerText}>没有更多了...</Text>
         </View>
       )
     }
   }

   render(){
     if(this.state.loaded){
       return(
         <Wapper>
           <ListView
             dataSource={this.state.dataSource}
             renderRow={this.renderRow}
             enableEmptySections={true}
             onEndReached={this.loadMore}
             onEndReachedThreshold={50}
             renderFooter={this.renderFooter}
           />
         </Wapper>
       )
     } else {
       return <View/>
     }
   }
 }

 const styles = StyleSheet.create({
   row: {
     width: size.width,
     flexDirection: 'row',
     height: 70,
     justifyContent: 'space-between',
     alignItems: 'center',
     paddingHorizontal: 20,
   },
   rowLeft: {
     flexDirection: 'row',
     alignItems: 'center',
     flex: 1,
   },
   cover: {
     height: 50,
     width: 50,
   },
   footer: {
     height: 50,
     width: size.width,
     justifyContent: 'center',
     alignItems: 'center',
     flexDirection: 'row',
   },
   footerText: {
     color: oc.gray3,
   }
 });

 SearchDetailPage.defaultProps = {
   vendor: '',
   type: 'album',
   searchKey: '',
 }

 export default SearchDetailPage
