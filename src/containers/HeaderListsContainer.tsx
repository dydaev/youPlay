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
  // onSetPlaylist(newPlaylist: playItemType[]): void;
  // onSetListOfPlaylists(newPlaylist: listOfPlaylistItemType[]): void;
}

const App: React.FunctionComponent<AppProps> = ({
  isVisible,
  showingList,
  onSetListsFromStorage,
  onSetCurrentTrackNumber,
  onSetCurrentPlaylistNumber,
}: AppProps) => {
  const mainContext: mainContextType = React.useContext<mainContextType>(MainContext);
  // const [listOfPlaylist, setListOfPlaylists] = React.useState<listOfPlaylistItemType[]>([]);
  const [selectdPlaylist, setSelectdPlaylist] = React.useState<number>(0);

  const { getAll: getPlaylist } = useIndexedDB('currentPlayList');
  const { getAll: getListOfPlaylists } = useIndexedDB('playLists');

  const updateMainState = async (): Promise<void> => {
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

  React.useEffect((): void => {
    updateMainState();
    //getPlaylist()
    // .then((playlistFromStor: playItemType[]) => {
    //   if (!lib.equal(mainContext.playList, playlistFromStor)) {
    //     onSetPlaylist(playlistFromStor);
    //   }
    // })
    // .catch((err: any): void => {
    //   console.log('Cannt read playlist from storage', err);
    // });

    //getListOfPlaylists()
    // .then((listOfPlaylistFromStorage: listOfPlaylistItemType[]) => {
    //   if (!lib.equal(listOfPlaylist, listOfPlaylistFromStorage)) {
    //     onSetListOfPlaylists(listOfPlaylistFromStorage);
    //   }
    // })
    // .catch((err: any): void => {
    //   console.log('Cannt read list of playlists from storage', err);
    // });
  });

  const handleSelectPlaylist = (numberOfPlaylist: number): void => {
    setSelectdPlaylist(numberOfPlaylist);
  };

  return (
    <div className="top-list_container" style={{ height: isVisible ? '100%' : 0 }}>
      <Playlist
        playlist={mainContext.playList}
        onSetCurrentTrackNumber={onSetCurrentTrackNumber}
        selectedTrackNumber={mainContext.currentTrackNumber}
        isShow={showingList === 'playlist'}
      />
      <Manager
        selectedPlaylist={mainContext.currentPlaylistNumber}
        playlists={mainContext.listOfPlaylist}
        onSetCurrentPlaylistNumber={onSetCurrentPlaylistNumber}
        isShow={showingList === 'manager'}
      />
    </div>
  );
};

export default App;
