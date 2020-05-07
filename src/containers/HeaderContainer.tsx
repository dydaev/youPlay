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

interface IHeaderContainerProps {
  isShow: boolean;
  isShowPlaylist: boolean;
  isShowSettings: boolean;
  onSetVolume(newVolume: number): void;
  onShowMenu(): void;
  onShowSettings(): void;
  onTogglePlaylist(): void;
  onChangePlaylistAndTrackNumbers(playlistNUmber: number, trackNumber: number): void;
  onSetPlaylistToMainState(
    newPlaylist: IPlayItemTypeV2[],
    newListOfPlaylist: listOfPlaylistItemType[],
  ): void;
}

const HeaderContainer = ({
  isShowSettings,
  isShowPlaylist,
  onSetVolume,
  onShowMenu,
  onShowSettings,
  onTogglePlaylist,
  onChangePlaylistAndTrackNumbers,
  onSetPlaylistToMainState,
  isShow,
}: IHeaderContainerProps): JSX.Element => {
  const mainContext: IMainContextType = React.useContext<IMainContextType>(MainContext);

  const {
    // getAll: getPlaylist,
    add: addPlaylistItem,
    clear: clearPlaylistItems,
  }: any = useIndexedDB('currentPlayList');

  // const {
  //   getAll: getListOfPlaylists,
  //   add: addPlaylistToList,
  //   clear: clearListOfPlaylists,
  //   update: updateListOfPlaylists,
  // }: any = useIndexedDB('playLists');

  // const getListsFromStorage = async (): Promise<void> => {
  //   try {
  //     const playList: IPlayItemTypeV2[] = await getPlaylist();
  //     const listOfPlayLists: listOfPlaylistItemType[] = await getListOfPlaylists();

  //     if (
  //       !lib.equal(playList, mainContext.playList) ||
  //       !lib.equal(listOfPlayLists, mainContext.listOfPlaylist)
  //     ) {
  //       onSetPlaylistToMainState(playList, listOfPlayLists)
  //     }
  //   } catch (err) {
  //     console.log('Cannt get playlist items from storage', err);
  //   }
  // };

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
        clearPlaylistItems().then((): void => {
          playlist.forEach((newPlaylistItem: IPlayItemTypeV2): void => {
            addPlaylistItem(newPlaylistItem);
          });
        });
        // .then((): void => {
        //   getListsFromStorage();
        // });
      }
    } else {
      mainContext.showMessage({ text: 'Didn`t select playlist', type: 'WARNING' });
    }
  };

  return (
    <Header
      volume={mainContext.settings.volume}
      isShow={isShow}
      isShowSettings={isShowSettings}
      isShowPlaylist={isShowPlaylist}
      isPlaylistEmpty={mainContext.playList && !mainContext.playList.length}
      onShowMenu={onShowMenu}
      onSetVolume={onSetVolume}
      onShowSettings={onShowSettings}
      onTogglePlaylist={onTogglePlaylist}
      onSetPlaylistToMainState={onSetPlaylistToMainState}
      onGetPlaylistFromServer={handleGetPlaylistFromServer}
      onChangePlaylistAndTrackNumbers={onChangePlaylistAndTrackNumbers}
    />
  );
};

export default HeaderContainer;
