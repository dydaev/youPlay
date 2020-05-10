import * as React from 'react';

import * as Axios from 'axios';

import { useIndexedDB } from 'react-indexed-db';
import lib from '../lib';
import { getPlaylistFromCurlServer, getPlaylistFromServer } from '../lib/getPlaylist';
import useStorage from '../lib/storage';

import MainContext from '../context';

import { IMainContextType } from '../types/mainContextType';
import { IMainStateType } from '../types/mainStateType';
import { IPlayItemTypeV2, ITubeTrackType } from '../types/playItemType';

import Header from '../components/Header';
import { listOfPlaylistItemType } from '../types/listOfPlaylistItemType';

import './HeaderContainer.scss';

const savingKeysForStorage = [
  'artist',
  'audioBitrate',
  'audioChannels',
  'audioSampleRate',
  'contentLength',
  'createDate',
  'description',
  'id',
  'idOfUpdatingInterval',
  'image',
  'lastUsedDate',
  'length',
  'pathToFile',
  'readiness',
  'song',
  'title',
  'type',
];

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

  // const {
  //   // getAll: getPlaylist,
  //   add: addPlaylistItem,
  //   clear: clearPlaylistItems,
  // }: any = useIndexedDB('currentPlayList');

  const handleGetTrackInfoFromServer = async (
    trackID: string,
    force = false,
  ): Promise<IPlayItemTypeV2 | void> => {
    // const trackUrl = url.replace(/&.*/, '');
    // const trackID = trackUrl.replace(/^.*v=/, '');

    if (/* mainContext.settings.directYoutubeLoad && */ trackID) {
      try {
        // @ts-ignore
        const res = await Axios(
          `${mainContext.settings.downloadServer}/getInfo/${trackID}${force ? '?force' : ''}`,
        );
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
      const updatedInfo = await handleGetTrackInfoFromServer(trackId);
      // console.log('updated trackInfo(' + trackId + '), readiness:', updatedInfo);s

      if (updatedInfo) {
        reff.current.setPlaylist(
          reff.current.statePlaylist.map(
            (ti: IPlayItemTypeV2): IPlayItemTypeV2 => {
              if (ti.id === trackId) {
                if (updatedInfo.readiness === 100 && ti.idOfUpdatingInterval) {
                  clearInterval(ti.idOfUpdatingInterval);
                  setTimeout(() => {
                    useStorage.replaceAll(
                      'currentPlayList',
                      reff.current.statePlaylist,
                      savingKeysForStorage,
                      true,
                    );
                  }, 500);

                  if (
                    // @ts-ignore
                    Array.isArray(window.intervals) &&
                    // @ts-ignore
                    window.intervals.includes(ti.idOfUpdatingInterval)
                  ) {
                    // @ts-ignore
                    window.intervals = window.intervals.filter(
                      (intId: NodeJS.Timeout): boolean => intId !== ti.idOfUpdatingInterval,
                    );
                  }
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

  const handleConvertTubeList = async (
    tubeList: ITubeTrackType[],
    forceId: any = null,
  ): Promise<void> => {
    if (tubeList && tubeList.length) {
      const newPlaylist = await tubeList.reduce(
        async (
          playlist: Promise<IPlayItemTypeV2[]>,
          tubeTrackInfo: ITubeTrackType,
        ): Promise<IPlayItemTypeV2[]> => {
          const trackUrl = tubeTrackInfo.url.replace(/&.*/, '');
          const trackID = trackUrl.replace(/^.*v=/, '');

          const isForceUpdating = forceId && forceId === trackID;

          const trackInfo = isForceUpdating
            ? await handleGetTrackInfoFromServer(trackID, true)
            : await handleGetTrackInfoFromServer(trackID);

          const oldTrackInfo = trackInfo
            ? mainContext.playList.find((st: IPlayItemTypeV2): boolean => trackInfo.id === st.id)
            : null;

          let idOfUpdatingInterval: any = { idOfUpdatingInterval: null };

          if (
            trackInfo &&
            typeof trackInfo.readiness !== 'undefined' &&
            trackInfo.readiness < 100
          ) {
            const Interval = (func: any, time: number, id: string): NodeJS.Timeout => {
              const intervalId: NodeJS.Timeout = setInterval(func, time, id);
              // @ts-ignore
              window.intervals = [
                // @ts-ignore
                ...(Array.isArray(window.intervals) ? window.intervals : []),
                intervalId,
              ];
              return intervalId;
            };

            // don`t rewrite intervalID if is(doubling interval)
            const updatingIntervalIsSet = oldTrackInfo && oldTrackInfo.idOfUpdatingInterval;

            const updatingIntervalIsLife =
              updatingIntervalIsSet &&
              // @ts-ignore
              Array.isArray(window.intervals) &&
              // @ts-ignore
              window.intervals.includes(oldTrackInfo.idOfUpdatingInterval);

            if (!updatingIntervalIsSet || !updatingIntervalIsLife) {
              if (!forceId || (forceId && isForceUpdating)) {
                idOfUpdatingInterval = {
                  idOfUpdatingInterval: Interval(handleCheckAndUpdateReadiness, 2000, trackInfo.id),
                };
              }
            }
          }

          return trackInfo
            ? [
                ...(await playlist),
                {
                  ...oldTrackInfo,
                  ...trackInfo,
                  ...idOfUpdatingInterval,
                },
              ]
            : [...(await playlist)];
        },
        Promise.resolve([]),
      );

      onSetPlaylistToMainState(newPlaylist);
      setGetingPlaylist(false);
      useStorage.replaceAll('currentPlayList', newPlaylist, savingKeysForStorage, true);
    }
  };

  const handleUpdatePlaylistFromServer = async (trackForForce: any = null): Promise<void> => {
    const tubeList = await handleGetPlaylistFromServer();

    if (tubeList && tubeList.length) {
      await handleConvertTubeList(tubeList, trackForForce ? trackForForce : null);
    }
  };

  const handleUpdateTrackForce = (trackForceId: string): void => {
    // onSetPlaylistToMainState(
    //   mainContext.playList.filter(
    //     (playItem: IPlayItemTypeV2): boolean => playItem.id !== trackForceId,
    //   ),
    // );
    if (trackForceId) handleUpdatePlaylistFromServer(trackForceId);
  };

  // React.useEffect(() => {
  //   if (Array.isArray(mainContext.playList) && mainContext.playList.length) {
  //     mainContext.playList.forEach((listItem: IPlayItemTypeV2): void => {
  //       const isNotLoadedTrack = listItem.readiness < 100;
  //       const trackIsLoading =
  //         listItem.idOfUpdatingInterval &&
  //         // @ts-ignore
  //         Array.isArray(window.intervals) &&
  //         // @ts-ignore
  //         window.intervals.includes(listItem.idOfUpdatingInterval);

  //       if (isNotLoadedTrack && !trackIsLoading) {
  //         handleCheckAndUpdateReadiness(listItem.id);
  //       }
  //     });
  //   }
  // });

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
      onUpdateTrackForce={handleUpdateTrackForce}
      onGetPlaylistFromServer={handleUpdatePlaylistFromServer}
      onChangePlaylistAndTrackNumbers={onChangePlaylistAndTrackNumbers}
    />
  );
};

export default HeaderContainer;
