import * as React from 'react';

import * as Axios from 'axios';

import { useIndexedDB } from 'react-indexed-db';
import lib from '../lib';
import { getPlaylistFromCurlServer, getPlaylistFromServer } from '../lib/getPlaylist';

import MainContext from '../context';

import { IMainContextType } from '../types/mainContextType';
import { IMainStateType } from '../types/mainStateType';
import { IPlayItemTypeV2 } from '../types/playItemType';

import Header from '../components/Header';
import { listOfPlaylistItemType } from '../types/listOfPlaylistItemType';

import './HeaderContainer.scss';

interface IListContainerProps {
  isShow: boolean;
  isShowPlaylist: boolean;
  isShowSettings: boolean;
  onSetVolume(newVolume: number): void;
  onShowMenu(): void;
  onShowSettings(): void;
  onTogglePlaylist(): void;
  setToMainState<K extends keyof IMainStateType>(
    newState: IMainStateType | Pick<IMainStateType, K>,
  ): void;
}

const ListContainer = ({
  isShowSettings,
  isShowPlaylist,
  onSetVolume,
  onShowMenu,
  onShowSettings,
  setToMainState,
  onTogglePlaylist,
  isShow,
}: IListContainerProps): JSX.Element => {
  const mainContext: IMainContextType = React.useContext<IMainContextType>(MainContext);

  const {
    getAll: getPlaylist,
    add: addPlaylistItem,
    clear: clearPlaylistItems,
  }: any = useIndexedDB('currentPlayList');

  const {
    getAll: getListOfPlaylists,
    add: addPlaylistToList,
    clear: clearListOfPlaylists,
    update: updateListOfPlaylists,
  }: any = useIndexedDB('playLists');

  const handleSetListsToState = (
    newPlaylist: IPlayItemTypeV2[],
    newListOfPlaylist: listOfPlaylistItemType[],
  ): void => {
    setToMainState({
      listOfPlaylist: newListOfPlaylist,
      playList: newPlaylist,
    });
  };

  const getListsFromStorage = async (): Promise<void> => {
    try {
      const playList: IPlayItemTypeV2[] = await getPlaylist();
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
      const playlist: IPlayItemTypeV2[] | void = mainContext.settings.thirdPartyServerForPlaylist
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
            playlist.forEach((newPlaylistItem: IPlayItemTypeV2): void => {
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

  const handleGetTrackInfoFromServer = async (url: string): Promise<IPlayItemTypeV2 | void> => {
    const trackUrl = url.replace(/&.*/, '');
    const trackID = trackUrl.replace(/^.*v=/, '');

    if (mainContext.settings.directYoutubeLoad && trackID) {
      try {
        // @ts-ignore
        const res = await Axios(`${mainContext.settings.downloadServer}/getInfo/${trackID}`);

        return JSON.parse(res);
      } catch (e) {
        mainContext.showMessage({
          text: 'Can`t get track(' + trackID + ') info!',
          type: 'WARNING',
        });
        console.error('Ошибка HTTP: ' + e);
        return null;
      }
    }
    return null;
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
    setToMainState({ currentPlaylistNumber: newNumber, currentTrackNumber: 0 });
    handleGetPlaylistFromServer();
  };

  const handleSetCurrentTrackNumber = (newNumber: number): void =>
    setToMainState({ currentTrackNumber: newNumber });

  React.useEffect((): void => {
    getListsFromStorage();
  });

  return (
    <Header
      volume={mainContext.settings.volume}
      isShow={isShow}
      isShowPlaylist={isShowPlaylist}
      isPlaylistEmpty={mainContext.playList && !mainContext.playList.length}
      onShowMenu={onShowMenu}
      onSetVolume={onSetVolume}
      isShowSettings={isShowSettings}
      onShowSettings={onShowSettings}
      onTogglePlaylist={onTogglePlaylist}
      setToMainState={setToMainState}
      onGetTrackInfoFromServer={handleGetTrackInfoFromServer}
      onUpdateListOfPlaylist={handleUpdateListOfPlaylist}
      onSetCurrentTrackNumber={handleSetCurrentTrackNumber}
      onGetPlaylistFromServer={handleGetPlaylistFromServer}
      onChangeCurrentPlaylistNumber={handleChangeCurrentPlaylistNumber}
      onAddNewPlaylistToListOfPlaylist={handleAddNewPlaylistToListOfPlaylist}
      onUpdatePlaylistInListOfPlaylist={handleUpdatePlaylistInListOfPlaylist}
    />
  );
};

export default ListContainer;
