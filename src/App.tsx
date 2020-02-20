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

const stateSavingItems = ["currentTrackNumber", "currentPlaylistNumber"];

const version = "1.0.3";
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
    isSavePlaying: false,
    playList: [],
    listOfPlaylist: [],
    duration: 0,
    currentTrackNumber: 0,
    currentPlaylistNumber: 0,
    progress: progressModel,
    settings: settingsModel,
  };

  UNSAFE_componentWillMount() {
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
        console.log("change fullscren");
        lib.useFullScreenMode(Nsettings.fullScreenMode);
      }
    }

    //if changed state for saving, save in stor
    if (
      // @ts-ignore: Unreachable code error
      stateSavingItems.some((stateName: string) => nextState[stateName] !== this.state[stateName])
    ) {
      this.handleSaveCurrentStateToStor(nextState);
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

  componentDidMount() {
    if (Array.isArray(this.state.listOfPlaylist) && !this.state.listOfPlaylist.length) {
      this.handleGetPlaylistFromStorage();
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

  handleUseMediaSession = () => {
    const navigator = window.navigator;

    try {
      // @ts-ignore: Unreachable code error
      navigator.mediaSession.setActionHandler("play", function(e: any) {
        console.log("pressed key play", e);
      });
    } catch (e) {
      console.log("error on set listner play in mediasession:", e);
    }
    try {
      // @ts-ignore: Unreachable code error
      navigator.mediaSession.setActionHandler("nexttrack", function(e: any) {
        console.log("pressed key nexttrack", e);
      });
    } catch (e) {
      console.log("error on set listner nexttrack in mediasession:", e);
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
      currentTrackNumber: 0,
      isPlaying: false,
    });
  };

  handleSetPlayList = (p: playItemType[]) => {
    // console.log("set playlist", p);
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

  handleSafeTrayPlaing = () => {
    if (this.state.isSavePlaying && this.state.settings.playInTray) {
      this.setState({
        isPlaying: true,
      });
    }
  };

  handleSetSafePlaying = (newStatePlaying: boolean) => {
    this.setState({
      isPlaying: newStatePlaying,
      isSavePlaying: newStatePlaying,
    });
  };

  handleSetPlaying = (newStatePlaying: boolean) => {
    this.setState({
      isPlaying: newStatePlaying,
    });
  };

  handleSaveCurrentStateToStor = (newState: StateType | void) => {
    const state = newState ? newState : this.state;

    db.removeData("currentState", {});
    if (
      (Array.isArray(state.playList) && state.playList.length) ||
      (Array.isArray(state.listOfPlaylist) && state.listOfPlaylist.length)
    ) {
      stateSavingItems.forEach((savingItemName: string) => {
        // @ts-ignore: Unreachable code error
        db.setData("currentState", { stateItem: savingItemName, value: state[savingItemName] });
      });
    }
  };

  handleGetStateFromStorage = () => {
    // currentTrackNumber, isPlaing, currentPlayPosition;
    const setStateFromStor = (params: any) => {
      if (params && params.rows && params.rows.length) {
        let currentState: any = {};

        for (let i = 0; i < params.rows.length; i++) {
          const rowItem: any = params.rows.item(i);

          if (rowItem.stateItem && rowItem.value)
            currentState = { ...currentState, [rowItem.stateItem]: rowItem.value };
        }

        if (Object.keys.length) this.setState(currentState);
      } else {
        // console.log("Storage data is empty, or:", params);
      }
    };

    db.getData("currentState", setStateFromStor);
  };

  handleGetPlaylistFromStorage = () => {
    const setPlaylistFunc = (params: any) => {
      if (params && params.rows && params.rows.length) {
        let playlist: listOfPlaylistItemType[] = [];

        for (let i = 0; i < params.rows.length; i++) {
          const rowItem: listOfPlaylistItemType = params.rows.item(i);
          playlist = [...playlist, rowItem];
        }
        if (Array.isArray(playlist) && playlist.length) {
          // console.log("playlist from stor", playlist);
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
            [rowItem.setting]: JSON.parse(rowItem.value),
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

  handlePlay = (trackNumber: number | undefined) => {
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
  handleStop = () => {
    this.setState({
      isPlaying: false,
      isSavePlaying: false,
    });
  };
  handlePrev = () => {
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
  handleNext = () => {
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
          onGetPleyListFromStorage={this.handleGetPlaylistFromStorage}
          onSetCurrentPlaylistNumber={this.handleSetCurrentPlaylistNumber}
          onSetList={this.handleSetList}
          onClose={this.handleSetBodyFill}
        />
        <Settings
          version={version}
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
