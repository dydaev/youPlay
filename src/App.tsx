import * as React from "react";
// @ts-ignore: Unreachable code error
import ReactPlayer from "react-player";

import MainContext from "./context";

// import Roll from './components/PlayRoll';
// import Player from './components/Player';
import Footer from "./components/Footer/index";
import Header from "./components/Header/index";
import Message from "./components/Massage/index";
import Settings from "./components/Settings/index";
import MainTimer from "./components/MainTimer/index";
// import Tabs from './components/Tabs';
import PlayListContainer from "./containers/PlayList";
import db from "./db";
// @ts-ignore: Unreachable code error
import lib from "./lib";

import { bodyType } from "./types/bodyType";
import { messageType } from "./types/messageType";
import { progressType } from "./types/progressType";
import { playItemType } from "./types/playItemType";
import { playStrategicType } from "./types/playStrategicType";
import { listOfPlaylistItemType } from "./types/listOfPlaylistItemType";
import { settingsType } from "./types/settingsType";

import { progressModel } from "./models/progressModel";
import { settingsModel } from "./models/settingsModel";

import "./main.scss";

export type PropsType = any;
type StateType = {
  bodyFill: bodyType;
  progress: progressType;
  settings: settingsType;
  playList: playItemType[];
  showMessage: messageType | null;
  playStrategic: playStrategicType;
  listOfPlaylist: listOfPlaylistItemType[];
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
    playUrl: "",
    bodyFill: "player",
    playStrategic: "normal",
    isShowMenu: true,
    isPlaying: false,
    isSavePlaying: true,
    playList: [],
    listOfPlaylist: [],
    duration: 0,
    currentTrackNumber: 0,
    currentPlaylistNumber: 0,
    progress: progressModel,
    settings: settingsModel,
  };

  componentWillMount() {
    this.handleGetSettingsFromStorage();
  }

  shouldComponentUpdate(nextProps: PropsType, nextState: StateType) {
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
    } = nextState;

    if (!equal(settings.fullScreenMode, Nsettings.fullScreenMode)) {
      if (window) {
        console.log("change fullscren");
        lib.useFullScreenMode(Nsettings.fullScreenMode);
      }
    }
    if (!equal(settings.playInTray, Nsettings.playInTray)) {
      if (window && isPlaying) {
        console.log("play in tray");
        lib.usePlaingInTry(this.state.isSavePlaying, this.handleSetPlaying);
      }
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
      !equal(currentTrackNumber, NcurrentTrackNumber)
    );
  }

  componentDidMount() {
    if (Array.isArray(this.state.listOfPlaylist) && !this.state.listOfPlaylist.length) {
      this.handleGetPlaylistFromStorage();
    }

    // if (Array.isArray(this.state.playList) && !this.state.playList.length) {
    //   this.handleGetCurrentPlaylistFromStorage();
    // }

    if (this.state.settings.playInTray && window && false) {
      lib.usePlaingInTry(this.state.isSavePlaying, this.handleSetPlaying);
    }

    if (window) {
      lib.useFullScreenMode(this.state.settings.fullScreenMode);
    }
  }

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

  handleSetSettings = (newState: settingsType) => {
    this.setState({
      settings: newState,
    });
  };
  handleSetMessage = (newState: messageType | null) => {
    this.setState({
      showMessage: newState,
    });
  };
  handleSetCurrentTrackNumber = (newState: number) => {
    this.setState({
      currentTrackNumber: newState,
    });
  };
  handleSetList = (newState: listOfPlaylistItemType[]) => {
    this.setState({
      listOfPlaylist: newState,
    });
  };
  handleSetCurrentPlaylistNumber = (newState: number) => {
    this.setState({
      currentPlaylistNumber: newState,
    });
  };

  handleSetPlayList = (p: playItemType[]) => {
    this.setState({
      playList: p,
    });
  };

  handleSetProgress = (p: progressType) => {
    this.setState({
      progress: p,
    });
  };

  handleSetBodyFill = (newBodyFill: bodyType) => {
    this.setState({
      bodyFill: newBodyFill,
    });
  };

  handleSavePlaying = (newState: boolean) => {
    this.setState({
      isSavePlaying: newState,
    });
  };

  handleSetPlaying = (newStatePlaying: boolean) => {
    this.setState({
      isPlaying: newStatePlaying,
    });
  };

  // handleGetCurrentPlaylistFromStorage = () => {
  //   const setPlaylistFunc = (params: any) => {
  //     if (params && params.rows && params.rows.length) {
  //       let playlist: listOfPlaylistItemType[] = [];

  //       for (let i = 0; i < params.rows.length; i++) {
  //         const rowItem: listOfPlaylistItemType = params.rows.item(i);
  //         playlist = [...playlist, rowItem];
  //       }
  //       console.log("listOfPlayList", playlist);
  //       // this.handleSetList(playlist);
  //     } else {
  //       console.log("Storage data is empty, or:", params);
  //     }
  //   };

  //   db.getData("currentPlayList", setPlaylistFunc);
  // };

  handleGetPlaylistFromStorage = () => {
    const setPlaylistFunc = (params: any) => {
      if (params && params.rows && params.rows.length) {
        let playlist: listOfPlaylistItemType[] = [];

        for (let i = 0; i < params.rows.length; i++) {
          const rowItem: listOfPlaylistItemType = params.rows.item(i);
          playlist = [...playlist, rowItem];
        }
        this.handleSetList(playlist);
      } else {
        // console.log('Storage data is empty, or:', params );
      }
    };

    db.getData("playLists", setPlaylistFunc);
  };

  handleGetSettingsFromStorage = () => {
    const setSettingsFunc = (params: any) => {
      let tempSetting: settingsType = settingsModel;

      if (params && params.rows && params.rows.length) {
        for (let i = 0; i < params.rows.length; i++) {
          const rowItem: { setting: string; value: any } = params.rows.item(i);

          tempSetting = {
            ...tempSetting,
            [rowItem.setting]: rowItem.value == "true",
          };
        }
      } else {
        Object.keys(settingsModel).map((settingName: string) => {
          // @ts-ignore: Unreachable code error
          db.setData("settings", { setting: settingName, value: settingsModel[settingName] });
        });
      }
      // console.log("reader setting", tempSetting);
      this.handleSetSettings(tempSetting);
    };
    db.getData("settings", setSettingsFunc);
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
        this.handleSetPlaying(true);
      } else {
        this.handleSetPlaying(!this.state.isPlaying);
      }
    } else if (
      Array.isArray(this.state.playList) &&
      this.state.playList.length &&
      trackNumber === undefined
    ) {
      this.handleSetPlaying(!this.state.isPlaying);
    } else {
      this.handleSetPlaying(false);
    }
  };
  handleStop = (): void => {
    this.setState({
      isPlaying: false,
    });
  };
  handlePrev = (): void => {
    const prevTrackNumber: number =
      Array.isArray(this.state.playList) && this.state.playList.length
        ? this.state.currentTrackNumber > 0
          ? this.state.currentTrackNumber - 1
          : this.state.playList.length - 1
        : 0;

    this.handlePlay(prevTrackNumber);
  };
  handleNext = (): void => {
    const nextTrackNumber: number =
      Array.isArray(this.state.playList) &&
      this.state.playList.length &&
      this.state.currentTrackNumber < this.state.playList.length - 1
        ? this.state.currentTrackNumber + 1
        : 0;

    this.handlePlay(nextTrackNumber);
  };

  handleSetDuration = (newDuration: number) => {
    this.setState({
      duration: newDuration,
    });
  };

  render() {
    const {
      bodyFill,
      progress,
      settings,
      playList,
      showMessage,
      playStrategic,
      listOfPlaylist,
      playUrl,
      duration,
      isPlaying,
      isShowMenu,
      isSavePlaying,
      currentTrackNumber,
      currentPlaylistNumber,
    } = this.state;

    const currentSong: playItemType | undefined =
      Array.isArray(playList) && playList.length ? playList[currentTrackNumber] : undefined;

    console.log(this, listOfPlaylist);

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
        <Message message={showMessage} onHide={() => this.handleSetMessage(null)} />
        <Header
          isShow={isShowMenu && bodyFill !== "settings" && bodyFill !== "list"}
          onClickButton={this.handleSetBodyFill}
          bodyType={bodyFill}
        />
        <PlayListContainer
          onShow={bodyFill === "list"}
          urlOfList={
            Array.isArray(listOfPlaylist) && listOfPlaylist[currentPlaylistNumber]
              ? listOfPlaylist[currentPlaylistNumber].url
              : ""
          }
          onPlay={this.handlePlay}
          onSetPlayList={this.handleSetPlayList}
          onSetCurrentTrack={this.handleSetCurrentTrackNumber}
          onSetCurrentPlaylistNumber={this.handleSetCurrentPlaylistNumber}
          onSetList={this.handleSetList}
          onClose={this.handleSetBodyFill}
        />
        <Settings
          mainSettings={settings}
          onShow={bodyFill === "settings"}
          onSetSettings={this.handleSetSettings}
          onClose={this.handleSetBodyFill}
        />
        <main onClick={() => this.setState({ isShowMenu: !isShowMenu })}>
          <MainTimer onShow={isShowMenu} duration={duration} progress={progress} />
          <img
            src={
              currentSong
                ? currentSong.image
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCzlqv9WfntXDekHwsLkf5NXI9isMvdwoVLgrQveqgexa10bWp"
            }
            alt="song image"
          />
        </main>
        <Footer
          runString={
            currentSong
              ? `${currentSong.title || ""} (${lib.seconds2time(Math.floor(duration))})`
              : ""
          }
          isShowFooter={isShowMenu && bodyFill !== "settings" && bodyFill !== "list"}
          isShowProgress={bodyFill !== "list"}
          isPlaying={isPlaying}
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
        />
      </MainContext.Provider>
    );
  }
}
export default Main;
