import * as React from 'react';

import { getPlaylistFromServer, getPlaylistFromCurlServer } from '../lib/getPlaylist';
import { useIndexedDB } from 'react-indexed-db';
import lib from '../lib';

import MainContext from '../context';

import { mainContextType } from '../types/mainContextType';
import { playItemType } from '../types/playItemType';

import { listOfPlaylistItemType } from '../types/listOfPlaylistItemType';
import Header from '../components/Header';

import { MainStateType } from '../App';

import './HeaderContainer.scss';

interface HeaderContainerProps {
  isShow: boolean;
  onSetVolume(newVolume: number): void;
  onShowMenu(): void;
  onShowSettings(): void;
  onSetBlurBg(newSatte: boolean): void;
  setToMainState<K extends keyof MainStateType>(
    newState: MainStateType | Pick<MainStateType, K>,
  ): void;
}

const HeaderContainer = ({
  onSetVolume,
  onShowMenu,
  onShowSettings,
  onSetBlurBg,
  setToMainState,
  isShow,
}: HeaderContainerProps): JSX.Element => {
  const mainContext: mainContextType = React.useContext<mainContextType>(MainContext);
  const {
    getAll: getPlaylist,
    add: addPlaylistItem,
    // @ts-ignore
    clear: clearPlaylistItems,
  }: any = useIndexedDB('currentPlayList');

  const {
    getAll: getListOfPlaylists,
    add: addPlaylistToList,
    // @ts-ignore
    clear: clearListOfPlaylists,
    update: updateListOfPlaylists,
  }: any = useIndexedDB('playLists');

  const handleSetListsToState = (
    newPlaylist: playItemType[],
    newListOfPlaylist: listOfPlaylistItemType[],
  ): void => {
    setToMainState({
      playList: newPlaylist,
      listOfPlaylist: newListOfPlaylist,
    });
  };

  const getListsFromStorage = async (): Promise<void> => {
    try {
      const playList: playItemType[] = await getPlaylist();
      const listOfPlayLists: listOfPlaylistItemType[] = await getListOfPlaylists();

      if (
        !lib.equal(playList, mainContext.playList) ||
        !lib.equal(listOfPlayLists, mainContext.listOfPlaylist)
      ) {
        handleSetListsToState(playList, listOfPlayLists);
      }
    } catch (err) {
      console.log('Cannt get playlist items from storage', err);
    }
  };

  const handleGetPlaylistFromServer = async (): Promise<void> => {
    if (
      !Number.isNaN(mainContext.currentPlaylistNumber) &&
      Array.isArray(mainContext.listOfPlaylist) &&
      mainContext.currentPlaylistNumber < mainContext.listOfPlaylist.length
    ) {
      const playlist: playItemType[] | void = mainContext.settings.thirdPartyServerForPlaylist
        ? await getPlaylistFromCurlServer(
            mainContext.listOfPlaylist[mainContext.currentPlaylistNumber].url,
            'https://cors-anywhere.herokuapp.com/',
            mainContext.showMessage,
          )
        : await getPlaylistFromServer(
            mainContext.listOfPlaylist[mainContext.currentPlaylistNumber].url,
            mainContext.settings.downloadServer,
            mainContext.showMessage,
          );

      if (playlist && !lib.equal(playlist, mainContext.playList)) {
        clearPlaylistItems()
          .then((): void => {
            playlist.forEach((newPlaylistItem: playItemType): void => {
              addPlaylistItem(newPlaylistItem);
            });
          })
          .then((): void => {
            getListsFromStorage();
          });
      }
    } else {
      mainContext.showMessage({ text: 'Didn`t select playlist', type: 'WARNING' });
    }
  };

  const handleAddNewPlaylistToListOfPlaylist = (newPlaylist: listOfPlaylistItemType): void => {
    clearListOfPlaylists()
      .then((): void => {
        mainContext.listOfPlaylist
          .concat(newPlaylist)
          .forEach((playlist: listOfPlaylistItemType): void => {
            addPlaylistToList(playlist);
          });
      })
      .then((): void => {
        getListsFromStorage();
      });
  };

  const handleUpdatePlaylistInListOfPlaylist = (playlist: listOfPlaylistItemType): void => {
    updateListOfPlaylists(playlist).then((): void => {
      getListsFromStorage();
    });
  };

  const handleUpdateListOfPlaylist = (updatedList: listOfPlaylistItemType[]): void => {
    clearListOfPlaylists()
      .then((): void => {
        updatedList.forEach((playlist: listOfPlaylistItemType): void => {
          addPlaylistToList(playlist);
        });
      })
      .then((): void => {
        getListsFromStorage();
      });
  };

  const handleChangeCurrentPlaylistNumber = (newNumber: number): void => {
    setToMainState({ currentPlaylistNumber: newNumber });
    handleGetPlaylistFromServer();
  };

  const handleSetCurrentTrackNumber = (newNumber: number): void =>
    setToMainState({ currentTrackNumber: newNumber });

  React.useEffect((): void => {
    getListsFromStorage();
  });

  return (
    <Header
      isShow={isShow}
      onShowMenu={onShowMenu}
      onSetVolume={onSetVolume}
      onSetBlurBg={onSetBlurBg}
      onShowSettings={onShowSettings}
      setToMainState={setToMainState}
      onUpdateListOfPlaylist={handleUpdateListOfPlaylist}
      onSetCurrentTrackNumber={handleSetCurrentTrackNumber}
      onGetPlaylistFromServer={handleGetPlaylistFromServer}
      onChangeCurrentPlaylistNumber={handleChangeCurrentPlaylistNumber}
      onAddNewPlaylistToListOfPlaylist={handleAddNewPlaylistToListOfPlaylist}
      onUpdatePlaylistInListOfPlaylist={handleUpdatePlaylistInListOfPlaylist}
    />
  );
};

export default HeaderContainer;
