import { listOfPlaylistItemType } from './listOfPlaylistItemType';
import { messageType } from './messageType';
import { IPlayItemTypeV2 } from './playItemType';
import { progressType } from './progressType';
import { settingsType } from './settingsType';

interface IMainContextType {
  duration: number;
  progress: progressType;
  isPlaying: boolean;
  settings: settingsType;
  playList: IPlayItemTypeV2[];
  currentTrackNumber: number;
  currentPlaylistNumber: number;
  listOfPlaylist: listOfPlaylistItemType[];
  showMessage(message: messageType | void): void;
  // getStateFromStorage?(): any;
}

export { IMainContextType };
