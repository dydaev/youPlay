import * as React from 'react';

import { IndexedDB, useIndexedDB, initDB } from 'react-indexed-db';
import MainContext from './context';

// import Roll from './components/PlayRoll';
// import Player from './components/Player';
import Footer from './components/Footer/index';
import Header from './components/Header/index';
import Message from './components/Massage/index';
import Settings from './components/Settings/index';
import MainTimer from './components/MainTimer/index';
// import Tabs from './components/Tabs';
import PlayListContainer from './containers/PlayList';
// import db from './db';
// Compiler warns about unreachable code error
import lib from './lib';

import { bodyType } from './types/bodyType';
import { messageType } from './types/messageType';
import { progressType } from './types/progressType';
import { playItemType } from './types/playItemType';
import { playStrategicType } from './types/playStrategicType';
import { listOfPlaylistItemType } from './types/listOfPlaylistItemType';
import { settingsType } from './types/settingsType';

import { progressModel } from './models/progressModel';
import { settingsModel } from './models/settingsModel';

import { DBConfig } from './dbConfig';

import './main.scss';

const version = '1.2.3';

const stateSavingItems = ['currentTrackNumber', 'currentPlaylistNumber'];

export type PropsType = {};
type StateType = {
  bodyFill: bodyType;
  progress: progressType;
  settings: settingsType;
  playList: playItemType[];
  showMessage: messageType | null;
  playStrategic: playStrategicType;
  listOfPlaylist: listOfPlaylistItemType[];
  footerIsMinimize: boolean;
  playUrl: string;
  duration: number;
  isPlaying: boolean;
  isShowMenu: boolean;
  isSavePlaying: boolean;
  currentTrackNumber: number;
  currentPlaylistNumber: number;
};

class Main extends React.Component<PropsType, StateType> {
  state: StateType = {
    showMessage: null,
    playUrl: '',
    bodyFill: 'player',
    playStrategic: 'normal',
    isShowMenu: true,
    isPlaying: false,
    isSavePlaying: false,
    playList: [],
    listOfPlaylist: [],
    duration: 0,
    currentTrackNumber: 0,
    currentPlaylistNumber: 0,
    progress: progressModel,
    settings: settingsModel,
    footerIsMinimize: false,
  };

  UNSAFE_componentWillMount(): void {
    initDB(DBConfig);
    // this.handleGetSettingsFromStorage();
  }

  shouldComponentUpdate(nextProps: PropsType, nextState: StateType): boolean {
    const { equal } = lib;

    const {
      showMessage,
      isShowMenu,
      bodyFill,
      progress,
      playList,
      listOfPlaylist,
      isPlaying,
      settings,
      currentTrackNumber,
      currentPlaylistNumber,
    } = this.state;

    const {
      showMessage: NshowMessage,

      isShowMenu: NIsShowMenu,
      bodyFill: NbodyFill,
      progress: Nprogress,
      playList: NplayList,
      listOfPlaylist: NListOfPlaylist,
      isPlaying: NisPlaying,
      settings: Nsettings,
      currentTrackNumber: NcurrentTrackNumber,
      currentPlaylistNumber: NcurrentPlaylistNumber,
    } = nextState;

    if (!equal(settings.fullScreenMode, Nsettings.fullScreenMode)) {
      if (window) {
        console.log('change fullscren');
        lib.useFullScreenMode(Nsettings.fullScreenMode);
      }
    }

    //if changed state for saving, save in stor
    if (
      // @ts-ignore: Unreachable code error
      stateSavingItems.some((stateName: string) => nextState[stateName] !== this.state[stateName])
    ) {
      this.handleClearStorage();
      this.handleAddStateToStorage(nextState);
    }

    if (Nsettings.playInTray /* !== settings.playInTray*/) {
      // console.log("play in tray");
      lib.usePlaingInTry(this.handleSafeTrayPlaing);
    }

    return (
      isShowMenu !== NIsShowMenu ||
      !equal(showMessage, NshowMessage) ||
      !equal(settings, Nsettings) ||
      !equal(bodyFill, NbodyFill) ||
      !equal(progress, Nprogress) ||
      !equal(playList, NplayList) ||
      !equal(listOfPlaylist, NListOfPlaylist) ||
      !equal(isPlaying, NisPlaying) ||
      !equal(currentTrackNumber, NcurrentTrackNumber) ||
      !equal(currentPlaylistNumber, NcurrentPlaylistNumber)
    );
  }

  componentDidMount(): void {
    if (Array.isArray(this.state.listOfPlaylist) && !this.state.listOfPlaylist.length) {
      // this.handleGetPlaylistFromStorage();
    }
    this.handleGetStateFromStorage();
    // if (Array.isArray(this.state.playList) && !this.state.playList.length) {
    //   this.handleGetCurrentPlaylistFromStorage();
    // }

    if (this.state.settings.playInTray) {
      lib.usePlaingInTry(this.handleSafeTrayPlaing);
    }

    if (window) {
      lib.useFullScreenMode(this.state.settings.fullScreenMode);
    }
    // this.handleUseMediaSession();
    // if (window) {
    //   window.addEventListener("keyup", function(e) {
    //     console.log("pressed key play", e.keyCode);
    //   });
    // }
  }

  handleGetStateFromStorage = (): void => {
    const { getAll } = useIndexedDB('currentState');

    getAll().then(
      (stateFromDb: any[]): void => {
        if (Array.isArray(stateFromDb) && stateFromDb.length) {
          this.setState(
            stateFromDb.reduce(
              (acc: any, stateParam: any): any => ({
                ...acc,
                [stateParam.stateItem]: stateParam.value,
              }),
              {},
            ),
          );
        }
      },
      (error: any): void => {
        console.log('Cannt get state from storage.', error);
      },
    );
  };

  handleAddStateToStorage = (newState: StateType | void): void => {
    const { add } = useIndexedDB('currentState');
    const state = newState ? newState : this.state;

    Object.keys(state).forEach((key: string): void => {
      // @ts-ignore:
      add({ stateItem: key, value: state[key] }).catch(err =>
        console.log('Cannt add state to storage.', err),
      );
    });
  };

  handleClearStorage = (): void => {
    // @ts-ignore:
    const { clear } = useIndexedDB('currentState');

    clear().catch((err: any): void => console.log('Cannt clear storage of currensState.', err));
  };

  handleToggleFooterMinimize = (): void => {
    this.setState({
      footerIsMinimize: !this.state.footerIsMinimize,
    });
  };

  handleUseMediaSession = (): void => {
    const navigator: any = window.navigator;
    if (navigator.mediaSession) {
      try {
        // @ts-ignore: Unreachable code error
        navigator.mediaSession.setActionHandler('play', function(e: string) {
          console.log('pressed key play', e);
        });
      } catch (e) {
        console.log('error on set listner play in mediasession:', e);
      }
      try {
        // @ts-ignore: Unreachable code error
        navigator.mediaSession.setActionHandler('nexttrack', function(e: string) {
          console.log('pressed key nexttrack', e);
        });
      } catch (e) {
        console.log('error on set listner nexttrack in mediasession:', e);
      }
    }
  };

  // handleSetShowMenu = (newState: boolean) => {
  //   this.setState({
  //     isShowMenu: newState
  //   });
  // }
  // handleSetPlayStrategic = (newState: playStrategicType) => {
  //   this.setState({
  //     playStrategic: newState
  //   });
  // }
  // useSettings = (settings: settingsType) => {
  //   lib.usePlaingInTry(this.state.isSavePlaying, this.handleSetPlaying);
  // }

  handleSetSettings = (newState: settingsType): void => {
    this.setState({
      settings: newState,
    });
  };
  handleSetMessage = (newState: messageType | null): void => {
    this.setState({
      showMessage: newState,
    });
  };
  handleSetCurrentTrackNumber = (newState: number): void => {
    this.setState({
      currentTrackNumber: newState,
    });
  };
  handleSetList = (newState: listOfPlaylistItemType[]): void => {
    console.log(newState);

    this.setState({
      listOfPlaylist: newState,
    });
  };
  handleSetCurrentPlaylistNumber = (newState: number): void => {
    this.setState({
      currentPlaylistNumber: newState,
      currentTrackNumber: 0,
      isPlaying: false,
    });
  };

  handleSetPlayList = (p: playItemType[]): void => {
    // console.log("set playlist", p);
    this.setState({
      playList: p,
    });
  };

  handleSetProgress = (p: progressType): void => {
    this.setState({
      progress: p,
    });
  };

  handleSetBodyFill = (newBodyFill: bodyType): void => {
    this.setState({
      bodyFill: newBodyFill,
    });
  };

  handleSavePlaying = (newState: boolean): void => {
    this.setState({
      isSavePlaying: newState,
    });
  };

  handleSafeTrayPlaing = (): void => {
    if (this.state.isSavePlaying && this.state.settings.playInTray) {
      this.setState({
        isPlaying: true,
      });
    }
  };

  handleSetSafePlaying = (newStatePlaying: boolean): void => {
    this.setState({
      isPlaying: newStatePlaying,
      isSavePlaying: newStatePlaying,
    });
  };

  handleSetPlaying = (newStatePlaying: boolean): void => {
    this.setState({
      isPlaying: newStatePlaying,
    });
  };

  handlePlay = (trackNumber: number | undefined): void => {
    if (
      Array.isArray(this.state.playList) &&
      this.state.playList.length &&
      trackNumber !== undefined
    ) {
      this.setState({
        playUrl: this.state.playList[trackNumber].url,
      });
      this.handleSetCurrentTrackNumber(trackNumber);

      if (trackNumber !== this.state.currentTrackNumber) {
        this.handleSetProgress(progressModel);
        this.handleSetSafePlaying(true);
      } else {
        this.handleSetSafePlaying(!this.state.isPlaying);
      }
    } else if (
      Array.isArray(this.state.playList) &&
      this.state.playList.length &&
      trackNumber === undefined
    ) {
      this.handleSetSafePlaying(!this.state.isPlaying);
    } else {
      this.handleSetSafePlaying(false);
    }
  };
  handleStop = (): void => {
    this.setState({
      isPlaying: false,
      isSavePlaying: false,
    });
  };
  handlePrev = (): void => {
    const prevTrackNumber: number =
      Array.isArray(this.state.playList) && this.state.playList.length
        ? this.state.currentTrackNumber > 0
          ? this.state.currentTrackNumber - 1
          : this.state.playList.length - 1
        : 0;

    this.setState({
      currentTrackNumber: prevTrackNumber,
    });

    if (this.state.isSavePlaying) this.handlePlay(prevTrackNumber);
  };
  handleNext = (): void => {
    const nextTrackNumber: number =
      Array.isArray(this.state.playList) &&
      this.state.playList.length &&
      this.state.currentTrackNumber < this.state.playList.length - 1
        ? this.state.currentTrackNumber + 1
        : 0;

    this.setState({
      currentTrackNumber: nextTrackNumber,
    });

    if (this.state.isSavePlaying) this.handlePlay(nextTrackNumber);
  };

  handleSetDuration = (newDuration: number): void => {
    this.setState({
      duration: newDuration,
    });
  };

  handleShowMenu = (): void => {
    this.setState({
      isShowMenu: !this.state.isShowMenu,
      footerIsMinimize: !this.state.footerIsMinimize,
    });
  };

  render(): React.ReactNode {
    const {
      bodyFill,
      progress,
      settings,
      playList,
      showMessage,
      playStrategic,
      listOfPlaylist,
      duration,
      isPlaying,
      isShowMenu,
      currentTrackNumber,
      currentPlaylistNumber,
      footerIsMinimize,
    } = this.state;

    const currentSong: playItemType | undefined =
      Array.isArray(playList) && playList.length ? playList[currentTrackNumber] : undefined;

    // if (window) {
    //   // @ts-ignore: Unreachable code error
    //   console.log(window.navigator.mediaSession);
    // } else {
    //   console.log(this.state);
    // }

    return (
      <MainContext.Provider
        value={{
          settings,
          duration,
          progress,
          isPlaying,
          currentTrackNumber,
          currentPlaylistNumber,
          listOfPlaylist,
          playList,
          showMessage: this.handleSetMessage,
        }}
      >
        <IndexedDB
          name={DBConfig.name}
          version={DBConfig.version}
          objectStoresMeta={DBConfig.objectStoresMeta}
        >
          <Message message={showMessage} onHide={(): void => this.handleSetMessage(null)} />
          <Header
            isShow={isShowMenu && bodyFill !== 'settings' && bodyFill !== 'list'}
            onShowMenu={this.handleShowMenu}
            onClickButton={this.handleSetBodyFill}
            bodyType={bodyFill}
          />
          <PlayListContainer
            onShow={bodyFill === 'list'}
            urlOfList={
              Array.isArray(listOfPlaylist) && listOfPlaylist[currentPlaylistNumber]
                ? listOfPlaylist[currentPlaylistNumber].url
                : ''
            }
            onPlay={this.handlePlay}
            onSetPlayList={this.handleSetPlayList}
            onSetCurrentTrack={this.handleSetCurrentTrackNumber}
            onGetPleyListFromStorage={(): void => {}} //this.handleGetPlaylistFromStorage
            onSetCurrentPlaylistNumber={this.handleSetCurrentPlaylistNumber}
            onSetList={this.handleSetList}
            onClose={this.handleSetBodyFill}
          />
          <Settings
            version={version}
            mainSettings={settings}
            onShow={bodyFill === 'settings'}
            onSetSettings={this.handleSetSettings}
            onClose={this.handleSetBodyFill}
          />
          <main onClick={this.handleShowMenu}>
            <MainTimer onShow={isShowMenu} duration={duration} progress={progress} />
            {!this.state.settings.showVideo && (
              <img
                src={
                  currentSong
                    ? currentSong.image
                    : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCzlqv9WfntXDekHwsLkf5NXI9isMvdwoVLgrQveqgexa10bWp'
                }
                alt="song image"
              />
            )}
          </main>
          <Footer
            playList={playList}
            currentTrackNumber={currentTrackNumber}
            runString={
              currentSong
                ? `${currentSong.title || ''} (${lib.seconds2time(Math.floor(duration))})`
                : ''
            }
            isShowFooter={isShowMenu && bodyFill !== 'settings' && bodyFill !== 'list'}
            isShowProgress={bodyFill !== 'list'}
            isPlaying={isPlaying}
            isMinimize={footerIsMinimize}
            onToogleMinimize={this.handleToggleFooterMinimize}
            playStrategic={playStrategic}
            currentTrack={
              Array.isArray(playList) && playList.length ? playList[currentTrackNumber] : null
            }
            setPlaying={this.handleSetPlaying}
            setDuration={this.handleSetDuration}
            setProgress={this.handleSetProgress}
            onSavePlay={this.handleSavePlaying}
            onPlay={this.handlePlay}
            onStop={this.handleStop}
            onPrev={this.handlePrev}
            onNext={this.handleNext}
            onShowFooter={this.handleShowMenu}
          />
        </IndexedDB>
      </MainContext.Provider>
    );
  }
}
export default Main;
