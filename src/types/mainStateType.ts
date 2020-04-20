import { progressType } from './progressType';
import { settingsType } from './settingsType';
import { listOfPlaylistItemType } from './listOfPlaylistItemType';
import { playItemType } from './playItemType';
import { messageType } from './messageType';

export type MainStateType = {
  duration: number;
  progress: progressType;
  settings: settingsType;
  isBlurBg: boolean;
  isPlaying: boolean;
  isReady: boolean;
  isShowFooter: boolean;
  isShowHeader: boolean;
  isShowPlaylist: boolean;
  isShowSettings: boolean;
  currentTrackNumber: number;
  currentPlaylistNumber: number;
  listOfPlaylist: listOfPlaylistItemType[];
  playList: playItemType[];
  message: messageType | null;
  PlayerRef: any;
};
