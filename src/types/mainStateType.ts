import { listOfPlaylistItemType } from './listOfPlaylistItemType';
import { messageType } from './messageType';
import { IPlayItemTypeV2 } from './playItemType';
import { progressType } from './progressType';
import { settingsType } from './settingsType';

export interface IMainStateType {
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
  playList: IPlayItemTypeV2[];
  message: messageType | null;
  PlayerRef: any;
}
