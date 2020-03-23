import * as React from 'react';
import TopList from '../TopList';
import HeaderListsContainer from '../../containers/HeaderListsContainer';
import { IndexedDB, useIndexedDB, initDB } from 'react-indexed-db';

import MainContext from '../../context';

import { bodyType } from '../../types/bodyType';

import './style.scss';
import { mainContextType } from '../../types/mainContextType';
import { playItemType } from '../../types/playItemType';
import { listOfPlaylistItemType } from '../../types/listOfPlaylistItemType';
import { MainStateType } from '../../App';

export type showingListType = 'playlist' | 'manager';

type propsType = {
  onSetVolume(newVolume: number): void;
  onShowMenu(): void;
  onShowSettings(): void;
  onSetBlurBg(newSatte: boolean): void;
  setToMainState<K extends keyof MainStateType>(
    newState: MainStateType | Pick<MainStateType, K>,
  ): void;
  bodyType: bodyType;
  isShow: boolean;
};

const stylesOfListButtons = { width: 0, padding: 0, margin: 0 };

const Header = ({
  setToMainState,
  isShow,
  onShowSettings,
  onShowMenu,
  onSetVolume,
  onSetBlurBg,
}: propsType): JSX.Element => {
  const mainContext: mainContextType = React.useContext<mainContextType>(MainContext);
  const [showingList, setShowingList] = React.useState<showingListType>('playlist');
  const [isShowPlaylist, setShowPlaylist] = React.useState(false);

  const handleSetListsToState = (
    newPlaylist: playItemType[],
    newListOfPlaylist: listOfPlaylistItemType[],
  ): void => {
    setToMainState({
      playList: newPlaylist,
      listOfPlaylist: newListOfPlaylist,
    });
  };

  const handleSetCurrentPlaylistNumber = (newNumber: number): void =>
    setToMainState({ currentPlaylistNumber: newNumber });

  const handleSetCurrentTreckNumber = (newNumber: number): void =>
    setToMainState({ currentTrackNumber: newNumber });

  const handleShowTopList = (): void => {
    setShowPlaylist(!isShowPlaylist);
    onSetBlurBg(!isShowPlaylist);
  };

  return (
    <div className="header-wrapper" style={isShowPlaylist ? {} : { height: 0 }}>
      <header id="main-header" style={isShow ? { marginTop: 85 } : {}}>
        <button id="settings" onClick={onShowSettings}>
          <i className="fas fa-tools"></i>
        </button>
        <h5 onClick={isShowPlaylist ? handleShowTopList : onShowMenu}>
          {!isShowPlaylist ? '-=plaYo=-' : showingList === 'playlist' ? 'Playlist' : 'Manager'}
        </h5>

        <button
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

        <button>
          <i className="fas fa-volume-up"></i>
          {/* <i className="fas fa-bars"></i> */}
        </button>
      </header>
      {/* <TopList
        isVisible={isShowPlaylist}
        setToMainState={handleSetPlaylist}
        onSetCurrentTrackNumber={handleSetCurrentTreckNumber}
      /> */}
      <HeaderListsContainer
        isVisible={isShowPlaylist}
        showingList={showingList}
        onSetListsFromStorage={handleSetListsToState}
        onSetCurrentTrackNumber={handleSetCurrentTreckNumber}
        onSetCurrentPlaylistNumber={handleSetCurrentPlaylistNumber}
      />
      <button
        className="header-wrapper_open-list"
        onClick={handleShowTopList}
        // style={isShowPlaylist ? { background: 'black' } : {}}
      >
        <div style={isShowPlaylist ? { width: '50%' } : {}} />
        <div style={isShowPlaylist ? { width: '100%' } : {}} />
      </button>
    </div>
  );
};

export default Header;
