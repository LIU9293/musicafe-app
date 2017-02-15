import { combineReducers } from 'redux';

const searchKeyInitState = {
  key: null,
  type: 'album',
  vendor: ['xiami', 'qq', 'netease']
}

const searchKey = (state = searchKeyInitState, action) => {
  switch (action.type) {
    case 'SEARCH_KEY_UPDATE_KEY':
      return {...state, key: action.key}
    case 'SEARCH_KEY_UPDATE_TYPE':
      return {...state, type: action.searchType}
    case 'SEARCH_KET_UPDATE_VENDOR':
      return {...state, vendor: action.vendor}
    default:
      return state;
  }
}

const initPlaylist = [
  {
    ident: 'initial',
    name: '我的歌单',
    songs: [],
  },
  {
    ident: 'current',
    name: '正在播放',
    defaultSongID: '',
    songs: [],
  }
];

const playlist = (state = initPlaylist, action) => {
  switch (action.type) {
    case 'CREATE_PLAYLIST':
      return [...state, {
        ident: action.ident,
        name: action.name,
        songs: action.songs || []
      }];
    case 'DELETE_PLAYLIST':
      return [...state].filter(x => x.ident !== action.ident);
    case 'INIT_PLAYLIST':
      return [...action.playlist];
    case 'ADD_SONG':
      let nextState = [...state].map(list => {
        if(list.ident === action.ident){
          list.songs.push(action.song);
        }
        return list;
      });
      return nextState;
    case 'DELETE_SONG':
      let newState = [...state];
      for(let i=0; i<newState.length; i++){
        if(newState[i].ident === action.ident){
          newState[i].songs = newState[i].songs.filter(x => x.id !== action.songID);
        }
      }
      return newState;
    case 'UPDATE_CURRENT_PLAYLIST':
      return [...state].map(item => {
        if(item.ident === 'current'){
          return {
            ident: 'current',
            name: '正在播放',
            defaultSongID: item.defaultSongID,
            songs: action.list
          }
        } else {
          return item;
        }
      });
    case 'UPDATE_CURRENT_PLAYLIST_WITH_SONG':
      return [...state].map(item => {
        if(item.ident === 'current'){
          return {
            ident: 'current',
            name: '正在播放',
            defaultSongID: action.songID,
            songs: action.list
          }
        } else {
          return item;
        }
      });
    default:
      return state;
  }
}

//playing : 1  - no song ever played
//          2  - has song in player
//          3  - playing
const appStatus = (state = {barStyle: 'light-content', playing: 1}, action) => {
  switch (action.type) {
    case 'CHANGE_STATUS_BAR':
      return {
        ...state,
        barStyle: action.style
      }
    case 'CHANGE_PLAYING_STATUS':
      return {
        ...state,
        playing: action.playing
      }
    default:
      return state;
  }
}

const downloadedSong = (state = {}, action) => {
  switch (action.type) {
    case 'INIT_DOWNLOADED_SONG':
      return {
        ...action.data
      }
    case 'ADD_DOWNLOADED_SONG':
      return {
        ...state,
        [action.uiqID]: action.songData
      }
    case 'DELETE_DOWNLOADED_SONG':
      let newState = {...state};
      delete newState[action.uiqID];
      return newState;
    default:
      return state;
  }
}

export default combineReducers({
  playlist,
  searchKey,
  appStatus,
  downloadedSong
})
