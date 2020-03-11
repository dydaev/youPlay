import { createContext } from 'react';

import { mainContextType } from './types/mainContextType';

export default createContext<mainContextType>({
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
  },
  playList: [],
  listOfPlaylist: [],
  showMessage: () => {},
});
