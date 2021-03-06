import * as React from 'react';
// import TopList from '../TopList';

import { listOfPlaylistItemType } from '../../types/listOfPlaylistItemType';
import { MainStateType } from '../../types/mainStateType';
import VolumeControl from '../VolumeControl/index';

import { Manager } from '../../components/Manager';
import { Playlist } from '../../components/Playlist';

import './style.scss';

export type showingListType = 'playlist' | 'manager';

interface IPropsType {
  volume: number;
  isShow: boolean;
  isShowSettings: boolean;
  isShowPlaylist: boolean;
  isPlaylistEmpty: boolean;
  onShowMenu(): void;
  onShowSettings(): void;
  onTogglePlaylist(): void;
  onGetPlaylistFromServer(): void;
  onSetVolume(newVolume: number): void;
  onSetCurrentTrackNumber(newNumber: number): void;
  onChangeCurrentPlaylistNumber(newNumber: number): void;
  onAddNewPlaylistToListOfPlaylist(newPlaylist: listOfPlaylistItemType): void;
  onUpdatePlaylistInListOfPlaylist(playlist: listOfPlaylistItemType): void;
  onUpdateListOfPlaylist(updatedList: listOfPlaylistItemType[]): void;
  setToMainState<K extends keyof MainStateType>(
    newState: MainStateType | Pick<MainStateType, K>,
  ): void;
}

const stylesOfListButtons = { width: 0, padding: 0, margin: 0 };

const Header = ({
  volume,
  isShow,
  isShowSettings,
  isShowPlaylist,
  isPlaylistEmpty,
  onShowSettings,
  onShowMenu,
  onSetVolume,
  onTogglePlaylist,
  onGetPlaylistFromServer,
  onSetCurrentTrackNumber,
  onAddNewPlaylistToListOfPlaylist,
  onUpdatePlaylistInListOfPlaylist,
  onUpdateListOfPlaylist,
  onChangeCurrentPlaylistNumber,
}: IPropsType): JSX.Element => {
  const [showingList, setShowingList] = React.useState<showingListType>('playlist');
  const [isShowVolumeControll, setIsShowVolumeControll] = React.useState(false);

  const handleShowTopList = (): void => {
    onTogglePlaylist();
    setIsShowVolumeControll(false);
    if (isShowPlaylist) setTimeout((): void => setShowingList('playlist'), 1000);
  };

  const handleToggleVolumeControll = (state: boolean): void => setIsShowVolumeControll(state);

  React.useEffect(() => {
    if (!isShow && isShowVolumeControll) setIsShowVolumeControll(false);
  });

  return (
    <div className="header-wrapper" style={isShowPlaylist ? {} : { height: 0 }}>
      <header id="main-header" style={isShow ? { marginTop: 78 } : { marginTop: -1 }}>
        <button
          id="settings"
          onClick={isShowPlaylist ? onGetPlaylistFromServer : onShowSettings}
          style={{ position: 'relative' }}
        >
          <i className="fas fa-chevron-left" style={isShowSettings ? {} : { fontSize: 0 }}></i>
          <i
            className="fas fa-tools"
            style={isShowPlaylist || isShowSettings ? { fontSize: 0 } : {}}
          ></i>
          <i
            className="fas fa-sync"
            style={!isShowPlaylist || isShowSettings ? { fontSize: 0 } : {}}
          ></i>
          {/* <i className="fas fa-tools" style={isShowPlaylist ? { left: -25 } : { left: 18 }}></i>
          <i className="fas fa-sync" style={!isShowPlaylist ? { right: -25 } : { right: 17 }}></i> */}
        </button>
        <h5
          onClick={
            isShowSettings ? onShowSettings : isShowPlaylist ? handleShowTopList : onShowMenu
          }
        >
          {!isShowPlaylist
            ? isShowSettings
              ? 'Settings'
              : '-=plaYo=-'
            : showingList === 'playlist'
            ? 'Playlist'
            : 'Manager'}
        </h5>

        <button
          className={
            isPlaylistEmpty && !isShowSettings && isShowPlaylist && showingList === 'playlist'
              ? 'blob purple'
              : ''
          }
          style={isShowPlaylist && showingList === 'playlist' ? {} : stylesOfListButtons}
          onClick={(): void => setShowingList('manager')}
        >
          <i className="fas fa-tasks"></i>
        </button>
        <button
          style={isShowPlaylist && showingList === 'manager' ? {} : stylesOfListButtons}
          onClick={(): void => setShowingList('playlist')}
        >
          <i className="fas fa-th-list"></i>
        </button>
        <VolumeControl
          volumeLevel={volume}
          onChangeVolume={onSetVolume}
          isShowControll={isShowVolumeControll}
          onToggleVolumeControll={handleToggleVolumeControll}
        />
      </header>
      <div className="top-list_container" style={{ height: isShow ? '100%' : 0 }}>
        <Playlist
          isShowTopList={isShow}
          isShow={showingList === 'playlist'}
          onSetCurrentTrackNumber={onSetCurrentTrackNumber}
        />
        <Manager
          isShowTopList={isShow}
          isShow={showingList === 'manager'}
          onChangeCurrentPlaylistNumber={onChangeCurrentPlaylistNumber}
          onAddPlaylist={onAddNewPlaylistToListOfPlaylist}
          onUpdatePlaylist={onUpdatePlaylistInListOfPlaylist}
          onUpdateListOfPlaylists={onUpdateListOfPlaylist}
        />
      </div>
      <button
        className={
          isPlaylistEmpty && !isShowSettings && !isShowPlaylist
            ? 'header-wrapper_open-list blob orange no_opacity'
            : 'header-wrapper_open-list'
        }
        onClick={!isShowSettings ? handleShowTopList : (): void => {}}
        style={isShowSettings ? { width: '100%', padding: '6px 0' } : {}}
      >
        <div style={isShowSettings ? { width: '100%' } : isShowPlaylist ? { width: '50%' } : {}} />
        <div style={isShowSettings ? { width: 0 } : isShowPlaylist ? { width: '100%' } : {}} />
      </button>
    </div>
  );
};

export default Header;
