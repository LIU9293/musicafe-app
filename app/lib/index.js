
/*
 * @providesModule lib
 */
import react, {Component} from 'react';
import oc from 'oc';
import api from 'api';
import { PixelRatio, Dimensions, Platform, View, AsyncStorage } from 'react-native';
const RNFS = require('react-native-fs');
const root = `${RNFS.DocumentDirectoryPath}/musicafe/`;

export const size = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height
};

export const ratio = PixelRatio.get();

export const os = Platform.OS;

export const jumpForward = (route) => {
  try{
    route.jumpForward()
  } catch(e){
    console.log(e);
  }
}

export const downloadOneSong = (vendor, id, albumID, songData, dispatch) => {
  return new Promise((resolve, reject) => {
    api.getSongURL(vendor, id, albumID)
      .then(url => {
        //set a tag for each vendor, name cannot be complex due to this issue:
        //https://github.com/react-native-community/react-native-video/issues/213
        let tag = 0;
        if(vendor === 'xiami'){tag = 1}
        if(vendor === 'qq'){tag = 2}
        if(vendor === 'netease'){tag = 3}

        let downloadDest = `${root}${tag}${id}.mp3`;

        //push an item in downloading song list
        dispatch({
          type: 'ADD_DOWNLOADING_SONG',
          song: {
            ...songData,
            vendor
          },
        });

        const ret = RNFS.downloadFile({
          fromUrl: url,
          toFile: downloadDest,
          begin: () => {},
          progress: () => {},
          background: true,
          progressDivider: 1
        });
        let jobId = ret.jobId;

        ret.promise
          .then(res => {
            console.log(`download file is: file://${downloadDest}`);
            console.log(`download response is: `, res);
            let newSongData = {
              ...songData,
              vendor: vendor,
              filePath: `file://${downloadDest}`,
              fileName: `${tag}${id}.mp3`,
              fileSize: res.bytesWritten,
            };
            dispatch({
              type: 'REMOVE_DOWNLOADING_SONG',
              id: id,
              vendor: vendor,
            });
            dispatch({
              type: 'ADD_DOWNLOADED_SONG',
              uiqID: `${tag}${id}`,
              songData: newSongData
            });
            jobId = -1;
            console.log('newSongData is : ', newSongData);
            try {
              AsyncStorage.getItem('download')
                .then(data => {
                  let jsonData = JSON.parse(data);
                  jsonData[`${tag}${id}`] = newSongData;
                  AsyncStorage.setItem(`download`, JSON.stringify(jsonData));
                })
                .catch(err => {
                  //no data yet
                  let key = `${tag}${id}`;
                  let initData = {};
                  initData[key] = newSongData;
                  AsyncStorage.setItem(`download`, JSON.stringify(initData));
                })
            } catch (error) {
              throw 'AsyncStorage error';
            }
          })
          .catch(err => {
            jobId = -1;
            throw 'download error';
          });
      })
      .catch(err => {
        console.log('download song error: ', err.toString());
        dispatch({
          type: 'REMOVE_DOWNLOADING_SONG',
          id: id,
          vendor: vendor,
        });
        reject(err);
      })
  });
}
