import * as React from 'react';
import TopList from '../TopList';

import { IndexedDB, useIndexedDB, initDB } from 'react-indexed-db';

import MainContext from '../../context';

import { bodyType } from '../../types/bodyType';

import './style.scss';
import { mainContextType } from '../../types/mainContextType';
import { playItemType } from '../../types/playItemType';

type propsType = {
  onSetVolume(newVolume: number): void;
  onShowMenu(): void;
  onShowSettings(): void;
  onSetBlurBg(newSatte: boolean): void;
  onSetPlaylist(key: string, value: any): void;
  bodyType: bodyType;
  isShow: boolean;
};

const Header = ({
  onSetPlaylist,
  isShow,
  onShowSettings,
  onShowMenu,
  onSetVolume,
  onSetBlurBg,
}: propsType): JSX.Element => {
  const mainContext: mainContextType = React.useContext<mainContextType>(MainContext);
  const [isShowPlaylist, setShowPlaylist] = React.useState(false);

  const handleSetPlaylist = (newPlaylist: playItemType[]): void => {
    onSetPlaylist('playList', newPlaylist);
  };

  const handleSetCurrentTreckNumber = (newNumber: number): void => {
    onSetPlaylist('currentTrackNumber', newNumber);
  };

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
          {isShowPlaylist ? 'Playlist' : '-=plaYo=-'}
        </h5>
        {isShowPlaylist && (
          <button>
            <i className="fas fa-tasks"></i>
          </button>
        )}
        <button>
          <i className="fas fa-volume-up"></i>
          {/* <i className="fas fa-bars"></i> */}
        </button>
      </header>
      <TopList
        isVisible={isShowPlaylist}
        onSetPlaylist={handleSetPlaylist}
        onSetCurrentTrackNumber={handleSetCurrentTreckNumber}
      />
      <button
        className="header-wrapper_open-ist"
        onClick={handleShowTopList}
        style={isShowPlaylist ? { background: 'black' } : {}}
      >
        <div style={isShowPlaylist ? { width: '50%' } : {}} />
        <div style={isShowPlaylist ? { width: '100%' } : {}} />
      </button>
    </div>
  );
};

export default Header;
