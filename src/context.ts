import { createContext } from 'react';

import { mainContextType } from './types/mainContextType';
import { useIndexedDB } from 'react-indexed-db';

let mainContext: mainContextType = {
  duration: NaN,
  isPlaying: false,
  currentTrackNumber: NaN,
  currentPlaylistNumber: NaN,
  progress: {
    playedSeconds: NaN,
    played: NaN,
    loadedSeconds: NaN,
    loaded: NaN,
  },
  settings: {
    directYoutubeLoad: false,
    fullScreenMode: false,
    playInTray: false,
    timeoutOfReadingFile: NaN,
    downloadServer: '',
    thirdPartyServerForPlaylist: false,
    showVideo: false,
    playStrategic: 'normal',
    volume: 1,
  },
  playList: [],
  listOfPlaylist: [],
  showMessage: () => {},
  // getStateFromStorage: () => {},
};

export default createContext<mainContextType>(mainContext);
