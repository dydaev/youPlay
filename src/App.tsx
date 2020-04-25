import * as React from 'react';

import { IndexedDB, useIndexedDB, initDB } from 'react-indexed-db';
import MainContext from './context';

// import Roll from './components/PlayRoll';
import Player from './components/Player';
import Footer from './components/Footer/index';
import Message from './components/Massage/index';
import Settings from './components/Settings/index';
// import MainTimer from './components/MainTimer/index';
import HeaderContainer from './containers/HeaderContainer';

import lib from './lib';
import useStorage from './lib/storage';

import { messageType } from './types/messageType';
import { progressType } from './types/progressType';
import { playItemType } from './types/playItemType';
import { settingsType } from './types/settingsType';
import { MainStateType } from './types/mainStateType';
import { listOfPlaylistItemType } from './types/listOfPlaylistItemType';

import { progressModel } from './models/progressModel';
import { settingsModel } from './models/settingsModel';

import { DBConfig } from './dbConfig';

import './main.scss';
import PlayerContainer from './containers/PlayerContainer';

const version = '1.3.0';
const stateSavingItems = ['currentTrackNumber', 'currentPlaylistNumber', 'settings'];

class Main extends React.Component<{}, MainStateType> {
  state: MainStateType = {
    currentTrackNumber: NaN,
    currentPlaylistNumber: NaN,
    duration: 0,
    isPlaying: false,
    isReady: false,
    isShowFooter: true,
    isShowHeader: true,
    isShowPlaylist: false,
    isShowSettings: false,
    settings: settingsModel,
    progress: progressModel,
    listOfPlaylist: [],
    playList: [],
    message: null,
    PlayerRef: React.createRef(),
    isBlurBg: false,
  };

  UNSAFE_componentWillMount(): void {
    initDB(DBConfig);
  }

  shouldComponentUpdate(nextProps: any, nextState: MainStateType): boolean {
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
          <K extends keyof MainStateType>(checkingSavingKey: K): boolean =>
            this.state[checkingSavingKey] !== nextState[checkingSavingKey],
        )
      ) {
        this.handleAddStateToStorage(nextState);
      }
      return true;
    } else return false;
  }
  componentDidMount(): void {
    this.handleGetStateFromStorage();
  }

  handleSetSettings = (newState: settingsType): void => {
    this.setState({
      settings: newState,
    });
  };

  handleSetState = <K extends keyof MainStateType>(
    newState: MainStateType | Pick<MainStateType, K>,
    // @ts-ignore
  ): void => this.setState({ ...newState });

  handleSetIsReady = (stateOfReady: boolean): void =>
    this.setState({
      isReady: stateOfReady,
    });

  handleSetMessage = (newMessage: messageType): void => {
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

  handleClearMessage = (id: number): void => {
    if (this.state.message && this.state.message.id === id) {
      this.setState({
        message: null,
      });
    }
  };

  handleSetPlayerRef = (ref: any): void => {
    this.setState({
      PlayerRef: ref,
    });
  };

  handlePlay = (): void => {
    const { isReady, isPlaying, currentTrackNumber, playList } = this.state;
    if (isReady) {
      if (isPlaying) {
        this.setState({
          isPlaying: false,
        });
      } else if (playList.length && currentTrackNumber !== NaN) {
        this.setState({
          isPlaying: true,
        });
      }
    }
  };

  handleShakeTracks = (): void => {
    if (this.state.settings.playStrategic === 'randome') {
      const { playList } = this.state;
      let currentIndex: number = playList.length,
        temporaryValue: playItemType,
        randomIndex: number,
        newArray: playItemType[];

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
    } else {
    }
  };

  handleNext = (): void => {
    const countOfTracks = this.state.playList.length;

    if (countOfTracks > 0) {
      if (this.state.settings.playStrategic !== 'replay') {
        //"normal" | "replay" | "randome" | "once"
        if (this.state.currentTrackNumber < countOfTracks - 1) {
          this.setState({
            currentTrackNumber: this.state.currentTrackNumber + 1,
          });
        } else if (this.state.settings.playStrategic !== 'once') {
          if (this.state.settings.playStrategic !== 'randome') this.handleShakeTracks();

          this.setState({
            currentTrackNumber: 0,
          });
        }
      }
    }
  };

  handlePrev = (): void => {
    const countOfTracks = this.state.playList.length;
    const secondsForChangeTrack = 5;

    if (countOfTracks > 0) {
      // if (this.state.duration < secondsForChangeTrack) {
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
          this.setState({
            currentTrackNumber:
              this.state.currentTrackNumber === 0
                ? countOfTracks - 1
                : this.state.currentTrackNumber - 1,
          });
          break;
      }
      // } else {
      //   this.handleSetSeek(0);
      // }
    }
  };

  handleSetSeek = (seconds: number): void => {
    if (this.state.PlayerRef && this.state.PlayerRef.current) {
      this.state.PlayerRef.current.seekTo(seconds);
    }
  };

  handleSetVolume = (newVolume: number): void => {
    this.setState({
      settings: {
        ...this.state.settings,
        volume: newVolume > 1 ? 1 : newVolume < 0 ? 0 : newVolume,
      },
    });
  };

  handleSetBlurBg = (newState: boolean): void => {
    this.setState({
      isBlurBg: newState,
    });
  };

  handleTogglePlaylist = (): void => {
    if (this.state.isShowHeader) {
      this.setState({
        isShowPlaylist: !this.state.isShowPlaylist,
        isBlurBg: !this.state.isShowPlaylist,
      });
    }
  };

  handleShowSettings = (): void => {
    this.setState({
      isBlurBg: !this.state.isBlurBg,
      isShowSettings: !this.state.isShowSettings,
    });
  };
  handleGetStateFromStorage = async (): Promise<void> => {
    this.setState(await useStorage.getAll('currentState'));
  };

  handleAddStateToStorage = (newState: MainStateType | void): void => {
    useStorage.replaceAll('currentState', newState, stateSavingItems);
  };

  handleToggleHeaderAndFooter = (): void => {
    this.setState({
      isShowFooter: !(this.state.isShowFooter || this.state.isShowHeader),
      isShowHeader: !(this.state.isShowFooter || this.state.isShowHeader),
    });
  };

  render(): React.ReactNode {
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
            onShowMenu={(): void => {}}
            onSetVolume={this.handleSetVolume}
            setToMainState={this.handleSetState}
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
