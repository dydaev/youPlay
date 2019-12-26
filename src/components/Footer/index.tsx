import * as React from "react";

// @ts-ignore: Unreachable code error
import MediaSession from "@mebtte/react-media-session";

const axios = require("axios");

// @ts-ignore: Unreachable code error
import ReactPlayer from "react-player";
import MainContext from "../../context";

import { playItemType } from "../../types/playItemType";
import { progressType } from "../../types/progressType";
import { mainContextType } from "../../types/mainContextType";
import { playStrategicType } from "../../types/playStrategicType";
import { bodyType } from "../../types/bodyType";

import "./style.scss";
import { log } from "util";

// type playerType = {
//   activePlayerRef: ƒ (player)
//   config: {soundcloud: {…}, youtube: {…}, facebook: {…}, dailymotion: {…}, vimeo: {…}, …}
//   context: {}
//   getCurrentTime: ƒ ()
//   getDuration: ƒ ()
//   getInternalPlayer: ƒ ()
//   getSecondsLoaded: ƒ ()
//   handleClickPreview: ƒ ()
//   handleReady: ƒ ()
//   player: Player {props: {…}, context: {…}, refs: {…}, updater: {…}, mounted: true, …}
//   props: {url: "https://youtube.com/watch?v=WoLNa5S1hkU", onSeek: ƒ, onPlay: ƒ, onEnded: ƒ, onPause: ƒ, …}
//   refs: {}
//   seekTo: ƒ (fraction, type)
//   showPreview: ƒ ()
//   state: {showPreview: false}
//   updater: {isMounted: ƒ, enqueueSetState: ƒ, enqueueReplaceState: ƒ, enqueueForceUpdate: ƒ}
//   wrapper: div
//   wrapperRef: ƒ (wrapper)
//   _reactInternalFiber: FiberNode {tag: 1, key: null, stateNode: ReactPlayer, elementType: ƒ, type: ƒ, …}
//   _reactInternalInstance: {_processChildContext: ƒ}
// }

type propsType = {
  runString: string;
  isShowFooter: boolean;
  isShowProgress: boolean;
  isPlaying: boolean;
  currentTrack: playItemType;
  playStrategic: playStrategicType;
  setPlaying(arg: boolean): void;
  onSavePlay(arg: boolean): void;
  setDuration(newDuration: number): void;
  setProgress(newProgress: progressType): void;
  onPlay(trackNumber: number): void;
  onStop(): void;
  onPrev(): void;
  onNext(): void;
};

const Footer = ({
  runString,
  isShowProgress = true,
  isShowFooter,
  playStrategic,
  currentTrack,
  setDuration,
  setProgress,
  setPlaying,
  isPlaying,
  onSavePlay,
  onPlay,
  onStop,
  onPrev,
  onNext,
}: propsType) => {
  const Player = React.useRef(null);
  const Line = React.useRef(null);

  React.useEffect(() => {
    // console.log(Player.current);
  });

  const [url, setUrl] = React.useState("");
  const [isPlayReady, setIsPlayReady] = React.useState(false);
  const [isMouseDown, setIsMouseDown] = React.useState(false);
  const [played, setPlayed] = React.useState(0);
  const [seeking, setSeeking] = React.useState(false);
  // const [bikeProgress, setBikeProgress] = React.useState(0);
  const [bikePsition, setBikePosition] = React.useState(0);
  const [songLength, setSongLength] = React.useState(0);
  const mainContext: mainContextType = React.useContext<mainContextType>(MainContext);

  const bikeSize = 36;

  const handlePlay = () => {
    onSavePlay(true);
    onPlay(undefined);
  };
  const handleStop = () => {
    onStop();
  };
  const handlePrev = () => {
    onPrev();
  };
  const handleNext = () => {
    onNext();
  };

  const handleBikePosition = (bikeShift: number = 0) => {
    const widthOfLine = Line.current.getBoundingClientRect().width;

    const bikeWidth = bikeSize * 1.25;

    const lineWithoutBike = widthOfLine - bikeWidth;

    return (bikeShift / 100) * lineWithoutBike;
  };

  const handleDuration = (newDuration: number): void => {
    setSongLength(newDuration);
    setDuration(newDuration);
  };

  const handleProgress = (newProgress: progressType): void => {
    setProgress(newProgress);

    // setBikeProgress(~~(newProgress.played * 100) || 0);
    if (!isMouseDown) setBikePosition(handleBikePosition(~~(newProgress.played * 100) || 0));
  };

  const handleBikePress = (e: any) => {
    // console.log("====================================";
    // console.log(e.clientX, e.target.getBoundingClientRect());
    // console.log("====================================");
  };

  const handleSeek = (an: any) => {
    // console.log("onSeek", an);
    return;
  };

  const styleShowingFooter = {
    bottom: 0,
  };

  const handlePalyingEnd = () => {
    // console.log("end play", playStrategic);
    switch (playStrategic) {
      case "once":
        // code...
        break;
      case "randome":
        // code...
        break;
      case "replay":
        // code...
        break;
      default:
        // is normal
        onNext();
        setPlaying(true);
    }
  };

  const handleLineMouseDown = (e: any) => {
    if (e.target.id === "progress_mover") {
      setIsMouseDown(true);
    }
  };

  const handleMouseMove = (e: any) => {
    if (isMouseDown) {
      const x = typeof e.touches === "object" ? e.touches[0].clientX : e.clientX;
      setBikePosition(x - bikeSize / 2);
    }
  };

  const handleLineMouseUp = (e: any) => {
    const widthOfLine = Line.current.getBoundingClientRect().width;
    const x = typeof e.changedTouches === "object" ? e.changedTouches[0].clientX : e.clientX;
    const positionOnClick = x / widthOfLine;

    Player.current.seekTo(positionOnClick);
    setIsMouseDown(false);
  };

  const handleCheckStartPlay = () => {
    // console.log("check playing", isPlaying, isPlayReady);
    // setTimeout(() => {
    //   if (isPlaying && !isPlayReady) {
    //     console.log("time checkout, playing next", isPlaying, isPlayReady);
    //     onNext();
    //     setPlaying(true);
    //   } else {
    //     setIsPlayReady(false);
    //     console.log("playing checkin");
    //   }
    // }, mainContext.settings.timeoutOfReadingFile);
  };

  const handlePlayerPlay = () => {
    // console.log("player is playing");
    if (!isPlaying) setPlaying(true);
  };

  const handleStartPlay = () => {
    // console.log("strat plaing");
    handleCheckStartPlay();
  };

  const handlePlayReady = () => {
    // console.log("onReady");
    setIsPlayReady(true);
  };

  const handleError = () => {
    console.log("error of plaing");
    onNext();
  };

  const changeUrl = (newUrl: string) => {
    if (url !== newUrl) {
      setUrl(newUrl);
      console.log("changed url", url);
    }
  };

  (() => {
    const trackUrl = currentTrack && currentTrack.url ? currentTrack.url.replace(/&.*/, "") : "";
    const trackID = trackUrl.replace(/^.*v=/, "");

    // if (!trackUrl) setUrl("");

    if (mainContext.settings.directYoutubeLoad && trackID) {
      //  {
      //   method: "GET", // *GET, POST, PUT, DELETE, etc.
      //   mode: "no-cors", // no-cors, cors, *same-origin
      //   cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      //   credentials: "same-origin", // include, *same-origin, omit
      //   headers: {
      //     "Content-Type": "application/text",
      //     // 'Content-Type': 'application/x-www-form-urlencoded',
      //   },
      //   redirect: "follow", // manual, *follow, error
      //   referrer: "no-referrer", // no-referrer, *client
      // }
      axios(`${mainContext.settings.downloadServer}/getTrackPath/${trackID}`)
        .then((res: any) => {
          if (res.statusText === "OK") {
            changeUrl(`${mainContext.settings.downloadServer}/${res.data}`);
          }
        })
        .catch((error: any) => console.error("Ошибка HTTP: " + error));
    } else {
      changeUrl(trackUrl);
    }
  })();

  return (
    <footer
      id="main-footer"
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      style={isShowFooter ? styleShowingFooter : {}}
    >
      <ReactPlayer
        ref={Player}
        onError={handleError}
        onReady={handlePlayReady}
        onStart={handleStartPlay}
        onSeek={handleSeek}
        url={url}
        onPlay={handlePlayerPlay}
        onEnded={handlePalyingEnd}
        onPause={() => setPlaying(false)}
        onProgress={handleProgress}
        onDuration={handleDuration}
        playing={isPlaying}
        width={0}
        height={0}
      />
      <MediaSession
        title={runString}
        artist="Roma"
        onPlay={() => {
          console.log("use key play");
          handlePlay();
        }}
        onPause={() => handleStop()}
        onPreviousTrack={() => handlePrev()}
        onNextTrack={() => handleNext()}
      />
      ;
      {isShowProgress && (
        <div
          className="main-footer__progress-liner"
          onMouseDown={handleLineMouseDown}
          onMouseUp={handleLineMouseUp}
          onTouchStart={handleLineMouseDown}
          onTouchEnd={handleLineMouseUp}
          ref={Line}
        >
          <span className="noselect">{runString}</span>
          <div
            style={{
              zIndex: 0,
              top: -40,
              height: 40,
              width: "100%",
              position: "absolute",
              background: "none",
            }}
          />
          <button
            style={{
              marginLeft: bikePsition || 0, //`${bikeProgress}%`,
              color: isMouseDown ? "gray" : "blueviolet",
              fontSize: isMouseDown ? 38 : bikeSize,
            }}
          >
            <i id="progress_mover" className="fas fa-biking"></i>
          </button>
          <div
            style={
              mainContext.progress && mainContext.progress.loaded
                ? { width: `${mainContext.progress.loaded * 100}%` }
                : { background: "lightgray" }
            }
          />
        </div>
      )}
      <div className="main-footer__control-buttons">
        <button style={{ fontSize: 30 }} onClick={handlePrev}>
          <i className="fas fa-angle-double-left"></i>
        </button>
        <button onClick={handlePlay}>
          <i className={isPlaying ? "fas fa-pause" : "fas fa-biking"}></i>
        </button>
        {/*// <button onClick={handleStop}>
        //   <i className="fas fa-stop"></i>
        // </button>*/}
        <button style={{ fontSize: 30 }} onClick={handleNext}>
          <i className="fas fa-angle-double-right"></i>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
