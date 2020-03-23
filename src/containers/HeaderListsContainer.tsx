import * as React from 'react';

import { Manager } from '../components/Manager';
import { Playlist } from '../components/Playlist';

import { useIndexedDB } from 'react-indexed-db';

import MainContext from '../context';

import { mainContextType } from '../types/mainContextType';
import { playItemType } from '../types/playItemType';

import { listOfPlaylistItemType } from '../types/listOfPlaylistItemType';
import { showingListType } from '../components/Header/index';

import './HeaderListsContainer.scss';
import lib from '../lib';

interface AppProps {
  isVisible: boolean;
  showingList: showingListType;
  onSetListsFromStorage(
    playlistFromStorage: playItemType[],
    listOfPlaylistsFromStorage: listOfPlaylistItemType[],
  ): void;
  onSetCurrentTrackNumber(newTrackNumber: number): void;
  onSetCurrentPlaylistNumber(newPlaylistNumber: number): void;
}

const App: React.FunctionComponent<AppProps> = ({
  isVisible,
  showingList,
  onSetListsFromStorage,
  onSetCurrentTrackNumber,
  onSetCurrentPlaylistNumber,
}: AppProps) => {
  const mainContext: mainContextType = React.useContext<mainContextType>(MainContext);

  const { getAll: getPlaylist } = useIndexedDB('currentPlayList');

  const {
    getAll: getListOfPlaylists,
    add: addPlaylistToList,
    // @ts-ignore
    clear: clearListOfPlaylists,
    update: updateListOfPlaylists,
  } = useIndexedDB('playLists');

  const getListsFromStorage = async (): Promise<void> => {
    try {
      const playList: playItemType[] = await getPlaylist();
      const listOfPlayLists: listOfPlaylistItemType[] = await getListOfPlaylists();

      if (
        !lib.equal(playList, mainContext.playList) ||
        !lib.equal(listOfPlayLists, mainContext.listOfPlaylist)
      ) {
        onSetListsFromStorage(playList, listOfPlayLists);
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

  React.useEffect((): void => {
    getListsFromStorage();
  });

  return (
    <div className="top-list_container" style={{ height: isVisible ? '100%' : 0 }}>
      <Playlist
        playlist={mainContext.playList}
        onSetCurrentTrackNumber={onSetCurrentTrackNumber}
        selectedTrackNumber={mainContext.currentTrackNumber}
        isShow={showingList === 'playlist'}
      />
      <Manager
        isShow={showingList === 'manager'}
        selectedPlaylist={mainContext.currentPlaylistNumber}
        playlists={mainContext.listOfPlaylist}
        onSetCurrentPlaylistNumber={onSetCurrentPlaylistNumber}
        onAddPlaylist={handleAddNewPlaylistToListOfPlaylist}
        onUpdatePlaylist={handleUpdatePlaylistInListOfPlaylist}
      />
    </div>
  );
};

export default App;
