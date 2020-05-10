import * as Axios from 'axios';
import * as React from 'react';

import { useIndexedDB } from 'react-indexed-db';
import lib from '../lib';
import {
  getPlaylistFromCurlServer,
  getPlaylistFromServer,
  handleGetPlaylistFromServer,
} from '../lib/getPlaylist';

import { Manager } from '../components/Manager';
import { Playlist } from '../components/Playlist';

import { IMainContextType } from '../types/mainContextType';
import { IPlayItemTypeV2, ITubeTrackType } from '../types/playItemType';

import MainContext from '../context';

import { listOfPlaylistItemType } from '../types/listOfPlaylistItemType';

import './HeaderContainer.scss';

interface IListContainerProps {
  isShow: boolean;
  showingList: string;
  onChangePlaylistAndTrackNumbers(playlistNUmber: number, trackNumber: number): void;
  // onGetTrackInfoFromServer(url: string): Promise<IPlayItemTypeV2 | void>;
  onGetPlaylistFromServer(): void;
  onUpdateTrackForce(trackForceId: string): void;
  onSetPlaylistToMainState(
    newPlaylist: IPlayItemTypeV2[],
    newListOfPlaylist: listOfPlaylistItemType[],
  ): void;
}

const ListContainer = ({
  isShow,
  showingList,
  onChangePlaylistAndTrackNumbers,
  onGetPlaylistFromServer,
  onUpdateTrackForce,
  onSetPlaylistToMainState,
}: IListContainerProps): JSX.Element => {
  const mainContext: IMainContextType = React.useContext<IMainContextType>(MainContext);

  const [tList, setTList] = React.useState<ITubeTrackType | []>([]);

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

  const getListsFromStorage = async (): Promise<void> => {
    try {
      const playList: IPlayItemTypeV2[] = await getPlaylist();
      const listOfPlayLists: listOfPlaylistItemType[] = await getListOfPlaylists();

      if (
        !lib.equal(playList, mainContext.playList) ||
        !lib.equal(listOfPlayLists, mainContext.listOfPlaylist)
      ) {
        onSetPlaylistToMainState(playList, listOfPlayLists);
      }
    } catch (err) {
      console.log('Cannt get playlist items from storage', err);
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
    onChangePlaylistAndTrackNumbers(newNumber, 0);
    onGetPlaylistFromServer();
  };

  const handleSetCurrentTrackNumber = (newNumber: number): void =>
    onChangePlaylistAndTrackNumbers(mainContext.currentPlaylistNumber, newNumber);

  React.useEffect((): void => {
    if (!mainContext.listOfPlaylist || !mainContext.listOfPlaylist.length) {
      getListsFromStorage();
    }
  });

  return (
    <div className="top-list_container" style={{ height: isShow ? '100%' : 0 }}>
      <Playlist
        isShowTopList={isShow}
        isShow={showingList === 'playlist'}
        onUpdateTrackForce={onUpdateTrackForce}
        onSetCurrentTrackNumber={handleSetCurrentTrackNumber}
      />
      <Manager
        isShowTopList={isShow}
        isShow={showingList === 'manager'}
        onChangeCurrentPlaylistNumber={handleChangeCurrentPlaylistNumber}
        onAddPlaylist={handleAddNewPlaylistToListOfPlaylist}
        onUpdatePlaylist={handleUpdatePlaylistInListOfPlaylist}
        onUpdateListOfPlaylists={handleUpdateListOfPlaylist}
      />
    </div>
  );
};

export default ListContainer;
