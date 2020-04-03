import * as React from 'react';
// import TopList from '../TopList';

import { MainStateType } from '../../types/mainStateType';
import { listOfPlaylistItemType } from '../../types/listOfPlaylistItemType';

import { Manager } from '../../components/Manager';
import { Playlist } from '../../components/Playlist';

import './style.scss';

export type showingListType = 'playlist' | 'manager';

type propsType = {
  isShow: boolean;
  isShowSettings: boolean;
  onShowMenu(): void;
  onShowSettings(): void;
  onGetPlaylistFromServer(): void;
  onSetVolume(newVolume: number): void;
  onSetBlurBg(newSatte: boolean): void;
  onSetCurrentTrackNumber(newNumber: number): void;
  onChangeCurrentPlaylistNumber(newNumber: number): void;
  onAddNewPlaylistToListOfPlaylist(newPlaylist: listOfPlaylistItemType): void;
  onUpdatePlaylistInListOfPlaylist(playlist: listOfPlaylistItemType): void;
  onUpdateListOfPlaylist(updatedList: listOfPlaylistItemType[]): void;
  setToMainState<K extends keyof MainStateType>(
    newState: MainStateType | Pick<MainStateType, K>,
  ): void;
};

const stylesOfListButtons = { width: 0, padding: 0, margin: 0 };

const Header = ({
  isShow,
  isShowSettings,
  onShowSettings,
  onShowMenu,
  onSetVolume,
  onSetBlurBg,
  onGetPlaylistFromServer,
  onSetCurrentTrackNumber,
  onAddNewPlaylistToListOfPlaylist,
  onUpdatePlaylistInListOfPlaylist,
  onUpdateListOfPlaylist,
  onChangeCurrentPlaylistNumber,
}: propsType): JSX.Element => {
  const [showingList, setShowingList] = React.useState<showingListType>('playlist');
  const [isShowToplist, setShowToplist] = React.useState(false);

  const handleShowTopList = (): void => {
    setShowToplist(!isShowToplist);
    onSetBlurBg(!isShowToplist);
  };

  return (
    <div className="header-wrapper" style={isShowToplist ? {} : { height: 0 }}>
      <header id="main-header" style={isShow ? { marginTop: 78 } : {}}>
        <button
          id="settings"
          onClick={isShowToplist ? onGetPlaylistFromServer : onShowSettings}
          style={{ position: 'relative' }}
        >
          <i className="fas fa-chevron-left" style={isShowSettings ? {} : { fontSize: 0 }}></i>
          <i
            className="fas fa-tools"
            style={isShowToplist || isShowSettings ? { fontSize: 0 } : {}}
          ></i>
          <i
            className="fas fa-sync"
            style={!isShowToplist || isShowSettings ? { fontSize: 0 } : {}}
          ></i>
          {/* <i className="fas fa-tools" style={isShowToplist ? { left: -25 } : { left: 18 }}></i>
          <i className="fas fa-sync" style={!isShowToplist ? { right: -25 } : { right: 17 }}></i> */}
        </button>
        <h5
          onClick={isShowSettings ? onShowSettings : isShowToplist ? handleShowTopList : onShowMenu}
        >
          {!isShowToplist
            ? isShowSettings
              ? 'Settings'
              : '-=plaYo=-'
            : showingList === 'playlist'
            ? 'Playlist'
            : 'Manager'}
        </h5>

        <button
          style={isShowToplist && showingList === 'playlist' ? {} : stylesOfListButtons}
          onClick={(): void => setShowingList('manager')}
        >
          <i className="fas fa-tasks"></i>
        </button>
        <button
          style={isShowToplist && showingList === 'manager' ? {} : stylesOfListButtons}
          onClick={(): void => setShowingList('playlist')}
        >
          <i className="fas fa-th-list"></i>
        </button>

        <button>
          <i className="fas fa-volume-up"></i>
          {/* <i className="fas fa-bars"></i> */}
        </button>
      </header>
      <div className="top-list_container" style={{ height: isShow ? '100%' : 0 }}>
        <Playlist
          // isShowTopList={isShow}
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
        className="header-wrapper_open-list"
        onClick={!isShowSettings ? handleShowTopList : (): void => {}}
        style={isShowSettings ? { width: '100%', padding: '6px 0' } : {}}
      >
        <div style={isShowSettings ? { width: '100%' } : isShowToplist ? { width: '50%' } : {}} />
        <div style={isShowSettings ? { width: 0 } : isShowToplist ? { width: '100%' } : {}} />
      </button>
    </div>
  );
};

export default Header;
