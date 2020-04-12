import { progressType } from './progressType';
import { settingsType } from './settingsType';
import { playItemType } from './playItemType';
import { messageType } from './messageType';
import { listOfPlaylistItemType } from './listOfPlaylistItemType';

type mainContextType = {
  duration: number;
  progress: progressType;
  isPlaying: boolean;
  settings: settingsType;
  playList: playItemType[];
  currentTrackNumber: number;
  currentPlaylistNumber: number;
  listOfPlaylist: listOfPlaylistItemType[];
  showMessage(message: messageType | void): void;
  //   getStateFromStorage?(): any;
};

export { mainContextType };
