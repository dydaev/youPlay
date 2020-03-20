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
  onSetBlurBg(newSatte: boolean): void;
  onSetPlaylist(key: string, value: any): void;
  bodyType: bodyType;
  isShow: boolean;
};

const Header = ({
  onSetPlaylist,
  isShow,
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

  const HandleShowTopList = (): void => {
    setShowPlaylist(!isShowPlaylist);
    onSetBlurBg(!isShowPlaylist);
  };

  return (
    <>
      <div className="header-wrapper">
        <header id="main-header" style={isShow ? { top: 0 } : {}}>
          <button id="settings" onClick={HandleShowTopList}>
            <i className="fas fa-tools"></i>
          </button>
          <h5 onClick={onShowMenu}>-=plaYo=-</h5>
          <button>
            <i className="fas fa-bars"></i>
          </button>
        </header>
        {isShowPlaylist && (
          <>
            <TopList
              isVisible={isShowPlaylist}
              onSetPlaylist={handleSetPlaylist}
              onSetCurrentTrackNumber={handleSetCurrentTreckNumber}
            />
            <div style={{ height: 83 }} />
          </>
        )}
      </div>
    </>
  );
};

export default Header;
