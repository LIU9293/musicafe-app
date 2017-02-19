/*
 * @providesModule api
 */
import refetch from 're-fetch';
const base = 'https://musicafe.co/api/';

const searchsong = (vendor, key, limit, page) => {
  return new Promise((resolve, reject) => {
    refetch(`${base}search/song/${vendor}?key=${key}&limit=${limit}&page=${page}`, {}, 4000, 2)
      .then(res => res.json())
      .then(json => resolve(json))
      .catch(err => reject(err))
  });
}

const searchalbum = (vendor, key, limit, page) => {
  return new Promise((resolve, reject) => {
    refetch(`${base}search/album/${vendor}?key=${key}&limit=${limit}&page=${page}`, {}, 4000, 2)
      .then(res => res.json())
      .then(json => resolve(json))
      .catch(err => reject(err))
  });
}

const searchplaylist = (vendor, key, limit, page) => {
  return new Promise((resolve, reject) => {
    refetch(`${base}search/playlist/${vendor}?key=${key}&limit=${limit}&page=${page}`, {}, 4000, 2)
      .then(res => res.json())
      .then(json => resolve(json))
      .catch(err => reject(err))
  });
}

const getsong = (vendor, id) => {
  return new Promise((resolve, reject) => {
    refetch(`${base}get/song/${vendor}?id=${id}`, {}, 4000, 2)
      .then(res => res.json())
      .then(json => resolve(json))
      .catch(err => reject(err))
  });
}

const getalbum = (vendor, id) => {
  return new Promise((resolve, reject) => {
    refetch(`${base}get/album/${vendor}?id=${id}`, {}, 4000, 2)
      .then(res => res.json())
      .then(json => resolve(json))
      .catch(err => reject(err))
  });
}

const getplaylist = (vendor, id) => {
  return new Promise((resolve, reject) => {
    refetch(`${base}get/playlist/${vendor}?id=${id}`, {}, 4000, 2)
      .then(res => res.json())
      .then(json => resolve(json))
      .catch(err => reject(err))
  });
}

/**
 * this one return a url of given songid, albumid, vendor,
 * handle xiami need pay song logic.
 */
const getSongURL= (vendor, id, albumid) => {
  return new Promise((resolve, reject) => {
    if(vendor === 'xiami' && albumid && albumid !== 0){
      getalbum(vendor, albumid)
        .then(res => {
          if(res.success){
            let list = res.songList;
            for(let i = 0; i < list.length; i++){
              if(list[i].id === id){
                resolve(list[i].file);
              }
            }
            reject('代码出了点问题哦😢');
          } else {
            reject(res.message);
          }
        })
        .catch(err => reject(err));
    } else {
      getsong(vendor, id)
        .then(res => {
          if(res.success){
            resolve(res.url);
          } else {
            reject(res.message);
          }
        })
        .catch(err => reject(err));
    }
  });
}

const getSearchSuggestion = (key) => {
  let url = `https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg?format=json&key=${key}&platform=yqq`;
  return new Promise((resolve, reject) => {
    refetch(url)
      .then(res => res.json())
      .then(json => resolve(json.data))
      .catch(err => reject({
        success: false,
        message: err
      }))
  });
}

module.exports = {
  searchsong,
  searchalbum,
  searchplaylist,
  getsong,
  getalbum,
  getplaylist,
  getSongURL,
  getSearchSuggestion
}
