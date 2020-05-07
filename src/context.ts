import { createContext } from 'react';

import { IMainContextType } from './types/mainContextType';
// import { useIndexedDB } from 'react-indexed-db';

const mainContext: IMainContextType = {
  currentPlaylistNumber: NaN,
  currentTrackNumber: NaN,
  duration: NaN,
  isPlaying: false,
  listOfPlaylist: [],
  playList: [],
  progress: {
    loaded: NaN,
    loadedSeconds: NaN,
    played: NaN,
    playedSeconds: NaN,
  },
  settings: {
    directYoutubeLoad: false,
    downloadServer: '',
    fullScreenMode: false,
    playInTray: false,
    playStrategic: 'normal',
    showVideo: false,
    thirdPartyServerForPlaylist: false,
    timeoutOfReadingFile: NaN,
    volume: 1,
  },
  // tslint:disable-next-line:no-empty
  showMessage: () => {},
  // getStateFromStorage: () => {},
};

export default createContext<IMainContextType>(mainContext);
