import * as React from 'react';

import { IndexedDB, useIndexedDB, initDB } from 'react-indexed-db';
import MainContext from './context';

// import Roll from './components/PlayRoll';
import Player from './components/Player';
import Footer from './components/Footer/index';
import Header from './components/Header/index';
import Message from './components/Massage/index';
import Settings from './components/Settings/index';
import MainTimer from './components/MainTimer/index';
// import Tabs from './components/Tabs';
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

const version = '1.3.0';

export type MainStateType = {
  duration: number;
  progress: progressType;
  settings: settingsType;
  isBlurBg: boolean;
  isPlaying: boolean;
  isReady: boolean;
  isShowFooter: boolean;
  isShowHeader: boolean;
  isShowSettings: boolean;
  currentTrackNumber: number;
  currentPlaylistNumber: number;
  listOfPlaylist: listOfPlaylistItemType[];
  playList: playItemType[];
  message: messageType | null;
  PlayerRef: any;
};

class Main extends React.Component<{}, MainStateType> {
  state: MainStateType = {
    currentTrackNumber: NaN,
    currentPlaylistNumber: NaN,
    duration: 0,
    isPlaying: false,
    isReady: false,
    isShowFooter: true,
    isShowHeader: true,
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
      !lib.equal(this.state.playList, nextState.playList) ||
      this.state.isBlurBg !== nextState.isBlurBg ||
      this.state.isShowSettings !== nextState.isShowSettings ||
      (!Number.isNaN(nextState.currentTrackNumber) &&
        this.state.currentTrackNumber !== nextState.currentTrackNumber) ||
      (!Number.isNaN(nextState.currentPlaylistNumber) &&
        this.state.currentPlaylistNumber !== nextState.currentPlaylistNumber)
    ) {
      console.log('save to storage updated state', nextState);
      return true;
    } else return false;
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

  // handleSetState = <K extends keyof MainStateType>(key: K, value: MainStateType[K]): void => {
  //   // @ts-ignore
  //   this.setState({
  //     [key]: value,
  //   });
  // };

  handleSetIsReady = (stateOfReady: boolean): void =>
    this.setState({
      isReady: stateOfReady,
    });

  handleSetMessage = (newMessage: messageType): void => {
    setTimeout(() => {
      this.handleClearMessage();
    }, 5000);

    this.setState({
      message: newMessage,
    });
  };
  handleClearMessage = (): void => {
    this.setState({
      message: null,
    });
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
      if (this.state.duration < secondsForChangeTrack) {
        if (this.state.settings.playStrategic !== 'replay') {
          //"normal" | "replay" | "randome" | "once"
          if (this.state.currentTrackNumber > 0) {
            this.setState({
              currentTrackNumber: countOfTracks - 1,
            });
          } else if (this.state.settings.playStrategic !== 'once') {
            if (this.state.settings.playStrategic !== 'randome') this.handleShakeTracks();

            this.setState({
              currentTrackNumber: countOfTracks - 1,
            });
          }
        }
      } else {
        this.handleSetSeek(0);
      }
    }
  };

  handleSetSeek = (seconds: number): void => {
    if (this.state.PlayerRef) {
      this.state.PlayerRef.current.seekTo(seconds);
    }
  };

  handleSetVolume = (newVolume: number): void => {
    this.setState({
      settings: {
        ...this.state.settings,
        volume: newVolume,
      },
    });
  };

  handleSetBlurBg = (newState: boolean): void => {
    this.setState({
      isBlurBg: newState,
    });
  };
  handleShowSettings = (): void => {
    this.setState({
      isShowSettings: !this.state.isShowSettings,
    });
  };

  render(): React.ReactNode {
    const {
      isBlurBg,
      isPlaying,
      isReady,
      isShowFooter,
      isShowHeader,
      settings,
      duration,
      progress,
      currentTrackNumber,
      currentPlaylistNumber,
      listOfPlaylist,
      playList,
      message,
      PlayerRef,
      isShowSettings,
    } = this.state;
    console.log(this);

    const currentTrack = playList[currentTrackNumber];

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
          <Message message={message} onHide={this.handleClearMessage} />
          <Header
            isShow={isShowHeader}
            setToMainState={this.handleSetState}
            onShowMenu={() => {}}
            onShowSettings={this.handleShowSettings}
            bodyType={'player'}
            onSetVolume={this.handleSetVolume}
            onSetBlurBg={this.handleSetBlurBg}
          />
          <Player
            ref={PlayerRef}
            isPlay={isPlaying}
            onSetReady={this.handleSetIsReady}
            url={''}
            isBlur={isBlurBg}
          />
          <Settings
            version={version}
            mainSettings={settings}
            isShow={isShowSettings}
            onSetSettings={this.handleSetSettings}
            onClose={(): void => {
              this.setState({ isShowSettings: !isShowSettings });
            }}
          />
          <Footer
            runString={
              currentTrack
                ? `${currentTrack.title || ''} (${lib.seconds2time(Math.floor(duration))})`
                : ''
            }
            isPlaying={isPlaying}
            isReady={isReady}
            onPlay={this.handlePlay}
            onPrev={this.handlePrev}
            onNext={this.handleNext}
            onSetSeekPosition={(): void => {}}
            isShowing={isShowFooter}
            progress={progress}
            isBlur={false}
            isBlurTitle={isBlurBg}
          />
        </IndexedDB>
      </MainContext.Provider>
    );
  }
}
export default Main;
