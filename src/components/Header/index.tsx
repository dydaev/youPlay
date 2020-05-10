import * as React from 'react';
// import TopList from '../TopList';

import ListContainer from '../../containers/ListContainer';
import VolumeControl from '../VolumeControl/index';

import { listOfPlaylistItemType } from '../../types/listOfPlaylistItemType';
import { IPlayItemTypeV2 } from '../../types/playItemType';

import './style.scss';

export type showingListType = 'playlist' | 'manager';

interface IPropsType {
  volume: number;
  isShow: boolean;
  isDownloadingPlaylist: boolean;
  isShowSettings: boolean;
  isShowPlaylist: boolean;
  isPlaylistEmpty: boolean;
  onShowMenu(): void;
  onShowSettings(): void;
  onTogglePlaylist(): void;
  onGetPlaylistFromServer(): void;
  onChangePlaylistAndTrackNumbers(playlistNUmber: number, trackNumber: number): void;
  onSetVolume(newVolume: number): void;
  onUpdateTrackForce(trackForceId: string): void;
  onSetPlaylistToMainState(
    newPlaylist: IPlayItemTypeV2[],
    newListOfPlaylist: listOfPlaylistItemType[],
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
  isDownloadingPlaylist,
  onUpdateTrackForce,
  onGetPlaylistFromServer,
  onSetPlaylistToMainState,
  onChangePlaylistAndTrackNumbers,
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
            className={isDownloadingPlaylist ? 'fas fa-sync rotate' : 'fas fa-sync'}
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
      <ListContainer
        isShow={isShow}
        showingList={showingList}
        onGetPlaylistFromServer={onGetPlaylistFromServer}
        onChangePlaylistAndTrackNumbers={onChangePlaylistAndTrackNumbers}
        onSetPlaylistToMainState={onSetPlaylistToMainState}
        onUpdateTrackForce={onUpdateTrackForce}
      />
      <button
        className={
          isPlaylistEmpty && !isShowSettings && !isShowPlaylist
            ? 'header-wrapper_open-list blob orange no_opacity'
            : 'header-wrapper_open-list'
        }
        // tslint:disable-next-line:no-empty
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
