import * as React from 'react';

import { IndexedDB, initDB } from 'react-indexed-db';
import MainContext from './context';

// import Roll from './components/PlayRoll';
// import MainTimer from './components/MainTimer/index';
import Footer from './components/Footer/index';
import Message from './components/Massage/index';
import Player from './components/Player';
import Settings from './components/Settings/index';
import HeaderContainer from './containers/HeaderContainer';

import lib from './lib';
import useStorage from './lib/storage';

import { IMainStateType } from './types/mainStateType';
import { messageType } from './types/messageType';
import { IPlayItemTypeV2 } from './types/playItemType';
import { progressType } from './types/progressType';
import { settingsType } from './types/settingsType';
// import { listOfPlaylistItemType } from './types/listOfPlaylistItemType';

import { progressModel } from './models/progressModel';
import { settingsModel } from './models/settingsModel';

import { DBConfig } from './dbConfig';

import PlayerContainer from './containers/PlayerContainer';

import './main.scss';
import { listOfPlaylistItemType } from './types/listOfPlaylistItemType';

const version = '2.0.0';
const stateSavingItems = ['currentTrackNumber', 'currentPlaylistNumber', 'settings'];

class Main extends React.Component<any, IMainStateType> {
  public state: IMainStateType = {
    currentPlaylistNumber: NaN,
    currentTrackNumber: NaN,
    duration: 0,
    isPlaying: false,
    isReady: false,
    isShowFooter: true,
    isShowHeader: true,
    isShowPlaylist: false,
    isShowSettings: false,
    listOfPlaylist: [],
    message: null,
    // tslint:disable-next-line:object-literal-sort-keys
    PlayerRef: React.createRef(),
    playList: [],
    progress: progressModel,
    settings: settingsModel,
    isBlurBg: false,
  };

  public UNSAFE_componentWillMount(): void {
    try {
      initDB(DBConfig);
    } catch (e) {
      console.log('error of initial db', e);
    }
  }

  public shouldComponentUpdate(nextProps: any, nextState: IMainStateType): boolean {
    if (
      this.state.isReady !== nextState.isReady ||
      this.state.isBlurBg !== nextState.isBlurBg ||
      this.state.isShowHeader !== nextState.isShowHeader ||
      this.state.isShowFooter !== nextState.isShowFooter ||
      this.state.isShowSettings !== nextState.isShowSettings ||
      this.state.isShowPlaylist !== nextState.isShowPlaylist ||
      this.state.isPlaying !== nextState.isPlaying ||
      !lib.equal(this.state.settings, nextState.settings) ||
      !lib.equal(this.state.message, nextState.message) ||
      !lib.equal(this.state.playList, nextState.playList) ||
      !lib.equal(this.state.listOfPlaylist, nextState.listOfPlaylist) ||
      (!Number.isNaN(nextState.currentTrackNumber) &&
        this.state.currentTrackNumber !== nextState.currentTrackNumber) ||
      (!Number.isNaN(nextState.currentPlaylistNumber) &&
        this.state.currentPlaylistNumber !== nextState.currentPlaylistNumber)
    ) {
      if (
        stateSavingItems.some(
          <K extends keyof IMainStateType>(checkingSavingKey: K): boolean =>
            this.state[checkingSavingKey] !== nextState[checkingSavingKey],
        )
      ) {
        this.handleAddStateToStorage(nextState);
      }
      return true;
    } else return false;
  }
  public componentDidMount(): void {
    this.handleGetStateFromStorage();
  }

  public handleSetSettings = (newState: settingsType): void => {
    this.setState({
      settings: newState,
    });
  };

  public handleSetState = <K extends keyof IMainStateType>(
    newState: IMainStateType | Pick<IMainStateType, K>,
    // @ts-ignore
  ): void => this.setState({ ...newState });

  public handleSetIsReady = (stateOfReady: boolean): void =>
    this.setState({
      isReady: stateOfReady,
    });

  public handleSetMessage = (newMessage: messageType): void => {
    if (newMessage.text && newMessage.text.length) {
      const newId: number = new Date().getTime();
      const showingTime = newMessage.text.length < 100 ? newMessage.text.length * 150 : 10000;

      setTimeout(() => {
        this.handleClearMessage(newId);
      }, showingTime);

      this.setState({
        message: { ...newMessage, id: newId },
      });
    }
  };

  public handleClearMessage = (id: number): void => {
    if (this.state.message && this.state.message.id === id) {
      this.setState({
        message: null,
      });
    }
  };

  public handleSetPlayerRef = (ref: any): void => {
    this.setState({
      PlayerRef: ref,
    });
  };

  public handlePlay = (): void => {
    const { isReady, isPlaying, currentTrackNumber, playList } = this.state;

    if (isReady) {
      if (isPlaying) {
        this.setState({
          isPlaying: false,
        });
      } else if (
        playList.length &&
        !Number.isNaN(currentTrackNumber) &&
        playList[currentTrackNumber].readiness === 100 &&
        playList[currentTrackNumber].pathToFile
      ) {
        this.setState({
          isPlaying: true,
        });
      }
    }
  };

  public handleShakeTracks = (): void => {
    if (this.state.settings.playStrategic === 'randome') {
      const { playList } = this.state;
      const newArray: IPlayItemTypeV2[] = [];
      // tslint:disable-next-line:one-variable-per-declaration
      let currentIndex: number = playList.length,
        temporaryValue: IPlayItemTypeV2,
        randomIndex: number;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = playList[currentIndex];
        newArray[currentIndex] = playList[randomIndex];
        newArray[randomIndex] = temporaryValue;
      }
      this.setState({ playList: newArray });
    }
  };

  // public handleChangeTrack = (newIndex: number): void => {
  //   const { currentTrackNumber, playList } = this.state;

  //   if (playList[currentTrackNumber].readiness === 100 && playList[currentTrackNumber].pathToFile) {
  //   }
  // };

  public handleNext = (): void => {
    const countOfTracks = this.state.playList.length;

    if (
      countOfTracks > 0 &&
      this.state.playList.some(
        (track: IPlayItemTypeV2): boolean => track.readiness === 100 && !!track.pathToFile,
      )
    ) {
      if (this.state.settings.playStrategic !== 'replay') {
        // "normal" | "replay" | "randome" | "once"
        if (this.state.currentTrackNumber < countOfTracks - 1) {
          const trueMask: boolean[] = this.state.playList.map(
            (track: IPlayItemTypeV2, index: number): boolean =>
              track.readiness === 100 && !!track.pathToFile,
          );

          let nextTrackNumber = trueMask.indexOf(true, this.state.currentTrackNumber + 1);

          if (nextTrackNumber < 0) nextTrackNumber = trueMask.indexOf(true);

          if (nextTrackNumber >= 0) {
            this.setState({
              currentTrackNumber: nextTrackNumber,
            });
          }
        } else if (this.state.settings.playStrategic !== 'once') {
          if (this.state.settings.playStrategic !== 'randome') this.handleShakeTracks();

          this.setState({
            currentTrackNumber: 0,
          });
        }
      }
    }
  };

  public handlePrev = (): void => {
    const countOfTracks = this.state.playList.length;
    const secondsForChangeTrack = 5;

    if (
      countOfTracks > 0 &&
      this.state.playList.some(
        (track: IPlayItemTypeV2): boolean => track.readiness === 100 && !!track.pathToFile,
      )
    ) {
      // if (this.state.duration < secondsForChangeTrack) {
      const trueMask: boolean[] = this.state.playList.map(
        (track: IPlayItemTypeV2, index: number): boolean =>
          track.readiness === 100 && !!track.pathToFile,
      );

      switch (this.state.settings.playStrategic) {
        case 'once':
          this.handleSetSeek(0);
          break;

        case 'randome':
          // if (this.state.currentTrackNumber === 0) this.handleShakeTracks();
          this.setState({
            currentTrackNumber:
              this.state.currentTrackNumber === 0
                ? countOfTracks - 1
                : this.state.currentTrackNumber - 1,
          });
          break;

        case 'replay':
          this.handleSetSeek(0);
          break;

        case 'normal':
          let nextTrackNumber = trueMask.lastIndexOf(true, this.state.currentTrackNumber - 1);

          if (nextTrackNumber < 0) nextTrackNumber = trueMask.lastIndexOf(true);

          this.setState({
            currentTrackNumber: nextTrackNumber,
          });
          break;
      }
    }
    // } else {
    //   this.handleSetSeek(0);
    // }
  };

  public handleSetSeek = (seconds: number): void => {
    if (this.state.PlayerRef && this.state.PlayerRef.current) {
      this.state.PlayerRef.current.seekTo(seconds);
    }
  };

  public handleSetVolume = (newVolume: number): void => {
    this.setState({
      settings: {
        ...this.state.settings,
        volume: newVolume > 1 ? 1 : newVolume < 0 ? 0 : newVolume,
      },
    });
  };

  public handleSetBlurBg = (newState: boolean): void => {
    this.setState({
      isBlurBg: newState,
    });
  };

  public handleTogglePlaylist = (): void => {
    if (this.state.isShowHeader) {
      this.setState({
        isBlurBg: !this.state.isShowPlaylist,
        isShowPlaylist: !this.state.isShowPlaylist,
      });
    }
  };

  public handleShowSettings = (): void => {
    this.setState({
      isBlurBg: !this.state.isBlurBg,
      isShowSettings: !this.state.isShowSettings,
    });
  };

  public handleGetStateFromStorage = async (): Promise<void> => {
    const ss = await useStorage.getAll('currentState');
    console.log(ss);

    this.setState(ss);
  };

  public handleAddStateToStorage = (newState: IMainStateType | void): void => {
    useStorage.replaceAll('currentState', newState, stateSavingItems);
  };

  public handleToggleHeaderAndFooter = (): void => {
    this.setState({
      isShowFooter: !(this.state.isShowFooter || this.state.isShowHeader),
      isShowHeader: !(this.state.isShowFooter || this.state.isShowHeader),
    });
  };

  public handleSetPlaylistToState = (
    newPlaylist: IPlayItemTypeV2[],
    newListOfPlaylist?: listOfPlaylistItemType[],
  ): void => {
    if (typeof newListOfPlaylist !== 'undefined') {
      this.setState({
        listOfPlaylist: newListOfPlaylist,
        playList: newPlaylist,
      });
    } else {
      this.setState({
        playList: newPlaylist,
      });
    }
  };

  public handleChangePlaylistAndTrackNumbers = (
    playlistNUmber: number,
    trackNumber: number,
  ): void =>
    this.setState({
      currentPlaylistNumber: playlistNUmber,
      currentTrackNumber: trackNumber,
    });

  public render(): React.ReactNode {
    const {
      isBlurBg,
      isPlaying,
      isReady,
      isShowFooter,
      isShowHeader,
      isShowPlaylist,
      isShowSettings,
      settings,
      duration,
      progress,
      currentTrackNumber,
      currentPlaylistNumber,
      listOfPlaylist,
      playList,
      message,
      PlayerRef,
    } = this.state;

    const currentTrack = playList[currentTrackNumber];
    console.log(this);

    return (
      <MainContext.Provider
        value={{
          currentPlaylistNumber,
          currentTrackNumber,
          duration,
          isPlaying,
          listOfPlaylist,
          playList,
          progress,
          settings,
          showMessage: this.handleSetMessage,
        }}
      >
        <IndexedDB
          name={DBConfig.name}
          version={DBConfig.version}
          objectStoresMeta={DBConfig.objectStoresMeta}
        >
          <Message message={message} onHide={this.handleClearMessage} />
          <Settings
            version={version}
            mainSettings={settings}
            isShow={isShowSettings}
            onSetSettings={this.handleSetSettings}
            onClose={(): void => {
              this.setState({ isShowSettings: !isShowSettings });
            }}
          />
          <HeaderContainer
            isShow={isShowHeader}
            isShowSettings={isShowSettings}
            isShowPlaylist={isShowPlaylist}
            onSetPlaylistToMainState={this.handleSetPlaylistToState}
            // tslint:disable-next-line:no-empty
            onShowMenu={(): void => {}}
            onSetVolume={this.handleSetVolume}
            onChangePlaylistAndTrackNumbers={this.handleChangePlaylistAndTrackNumbers}
            onShowSettings={this.handleShowSettings}
            onTogglePlaylist={this.handleTogglePlaylist}
          />
          <PlayerContainer
            ref={PlayerRef}
            track={currentTrack}
            isPlay={isPlaying}
            isBlur={isBlurBg}
            isReady={isReady}
            isPlaying={isPlaying}
            isBlurTitle={isBlurBg}
            isShowing={isShowFooter}
            isShowHeader={isShowHeader}
            onPlay={this.handlePlay}
            onPrev={this.handlePrev}
            onNext={this.handleNext}
            onTrackEnded={this.handleNext}
            onSetReady={this.handleSetIsReady}
            trackTitle={(currentTrack && currentTrack.title) || ''}
            onToggleHeaderAndFooter={this.handleToggleHeaderAndFooter}
            onTogglePlaylist={this.handleTogglePlaylist}
          />
        </IndexedDB>
      </MainContext.Provider>
    );
  }
}
export default Main;
