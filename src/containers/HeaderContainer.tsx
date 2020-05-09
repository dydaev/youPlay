import * as React from 'react';

import * as Axios from 'axios';

import { useIndexedDB } from 'react-indexed-db';
import lib from '../lib';
import { getPlaylistFromCurlServer, getPlaylistFromServer } from '../lib/getPlaylist';

import MainContext from '../context';

import { IMainContextType } from '../types/mainContextType';
import { IMainStateType } from '../types/mainStateType';
import { IPlayItemTypeV2, ITubeTrackType } from '../types/playItemType';

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
    newListOfPlaylist?: listOfPlaylistItemType[],
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
  const reff = React.useRef(null);
  const mainContext: IMainContextType = React.useContext<IMainContextType>(MainContext);
  reff.current = { statePlaylist: mainContext.playList, setPlaylist: onSetPlaylistToMainState };

  const [isGetingPlaylist, setGetingPlaylist] = React.useState(false);

  const {
    // getAll: getPlaylist,
    add: addPlaylistItem,
    clear: clearPlaylistItems,
  }: any = useIndexedDB('currentPlayList');

  const handleGetTrackInfoFromServer = async (url: string): Promise<IPlayItemTypeV2 | void> => {
    const trackUrl = url.replace(/&.*/, '');
    const trackID = trackUrl.replace(/^.*v=/, '');

    if (/* mainContext.settings.directYoutubeLoad && */ trackID) {
      try {
        // @ts-ignore
        const res = await Axios(`${mainContext.settings.downloadServer}/getInfo/${trackID}`);
        if (res.statusText === 'OK') return res.data;
        else return null;
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

  const handleGetPlaylistFromServer = async (): Promise<ITubeTrackType[] | void> => {
    if (
      !Number.isNaN(mainContext.currentPlaylistNumber) &&
      Array.isArray(mainContext.listOfPlaylist) &&
      mainContext.currentPlaylistNumber < mainContext.listOfPlaylist.length
    ) {
      setGetingPlaylist(true);
      try {
        const tubePlaylistFromServer: ITubeTrackType[] = mainContext.settings
          .thirdPartyServerForPlaylist
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
        // setTubePlaylist(tubePlaylistFromServer);
        return tubePlaylistFromServer;
      } catch (e) {
        setGetingPlaylist(false);
      }
    } else {
      mainContext.showMessage({ text: 'Didn`t select playlist', type: 'WARNING' });
    }
    return null;
  };

  const handleCheckAndUpdateReadiness = async (trackId: string): Promise<void> => {
    const trackInfo: IPlayItemTypeV2 = reff.current.statePlaylist.find(
      (ti: IPlayItemTypeV2): boolean => ti.id === trackId,
    );

    if (typeof trackInfo !== 'undefined') {
      // if (trackInfo.readiness < 100) {
      const urlOfTrack = `https://www.youtube.com/watch?v=${trackId}`;
      const updatedInfo = await handleGetTrackInfoFromServer(urlOfTrack);
      console.log('updated trackInfo(' + trackId + '), readiness:', updatedInfo);

      if (updatedInfo) {
        reff.current.setPlaylist(
          reff.current.statePlaylist.map(
            (ti: IPlayItemTypeV2): IPlayItemTypeV2 => {
              if (ti.id === trackId) {
                if (updatedInfo.readiness === 100 && ti.idOfUpdatingInterval) {
                  clearInterval(ti.idOfUpdatingInterval);
                }

                return {
                  ...ti,
                  ...updatedInfo,
                  ...(updatedInfo.readiness < 100
                    ? {}
                    : {
                        idOfUpdatingInterval: null,
                      }),
                };
              } else return ti;
            },
          ),
        );
      }
      // }
    }
  };

  const handleConvertTubeList = async (tubeList: ITubeTrackType[]): Promise<void> => {
    if (tubeList && tubeList.length) {
      const newPlaylist = await tubeList.reduce(
        async (
          playlist: Promise<IPlayItemTypeV2[]>,
          tubeTrackInfo: ITubeTrackType,
        ): Promise<IPlayItemTypeV2[]> => {
          const trackInfo = await handleGetTrackInfoFromServer(tubeTrackInfo.url);

          const oldTrackInfo = trackInfo
            ? mainContext.playList.find((st: IPlayItemTypeV2): boolean => st.id === trackInfo.id)
            : null;

          return trackInfo
            ? [
                ...(await playlist),
                {
                  ...trackInfo,
                  idOfUpdatingInterval:
                    oldTrackInfo && oldTrackInfo.idOfUpdatingInterval && trackInfo.readiness < 100
                      ? oldTrackInfo.idOfUpdatingInterval // don`t rewrite intervalID if is(doubling interval)
                      : trackInfo.readiness < 100
                      ? setInterval(handleCheckAndUpdateReadiness, 2000, trackInfo.id)
                      : null,
                },
              ]
            : [...(await playlist)];
        },
        Promise.resolve([]),
      );

      onSetPlaylistToMainState(newPlaylist);
      setGetingPlaylist(false);
      // setPlaylist(newPlaylist);
      console.log('converted list', newPlaylist);
    }
  };

  const handleUpdatePlaylistFromServer = async (): Promise<void> => {
    const tubeList = await handleGetPlaylistFromServer();

    if (tubeList && tubeList.length) {
      await handleConvertTubeList(tubeList);
    }
  };

  return (
    <Header
      volume={mainContext.settings.volume}
      isShow={isShow}
      isShowSettings={isShowSettings}
      isShowPlaylist={isShowPlaylist}
      isDownloadingPlaylist={isGetingPlaylist}
      isPlaylistEmpty={mainContext.playList && !mainContext.playList.length}
      onShowMenu={onShowMenu}
      onSetVolume={onSetVolume}
      onShowSettings={onShowSettings}
      onTogglePlaylist={onTogglePlaylist}
      onSetPlaylistToMainState={onSetPlaylistToMainState}
      onGetPlaylistFromServer={handleUpdatePlaylistFromServer}
      onChangePlaylistAndTrackNumbers={onChangePlaylistAndTrackNumbers}
    />
  );
};

export default HeaderContainer;
