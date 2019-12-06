import * as React from "react";

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

  const [isMouseDown, setIsMouseDown] = React.useState(false);
  const [played, setPlayed] = React.useState(0);
  const [seeking, setSeeking] = React.useState(false);
  const [bikeProgress, setBikeProgress] = React.useState(0);
  const [songLength, setSongLength] = React.useState(0);
  const mainContext: mainContextType = React.useContext<mainContextType>(MainContext);

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

  const handleDuration = (newDuration: number): void => {
    setSongLength(newDuration);
    setDuration(newDuration);
  };

  const handleProgress = (newProgress: progressType): void => {
    setProgress(newProgress);
    //       if (newProgress.played === 1) onNext();

    setBikeProgress(~~(newProgress.played * 100) || 0);
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

  const handleBikeMouseDown = (e: any) => {
    // console.log("bike down");
    // console.log(e.clientX);
  };
  const handleBikeMouseUp = (e: any) => {
    // console.log("bike up");
    // console.log(e.clientX, e.target.getBoundingClientRect());
  };

  const footerMouseDown = (e: any) => {
    if (e.target.id === "progress_mover") {
      setIsMouseDown(true);
    }
    // else if (e.target.className === "main-footer__progress-liner") {
    //   const widthOfLine = Line.current.getBoundingClientRect().width;
    //   const positionOnClick = e.clientX / widthOfLine;

    //   Player.current.seekTo(positionOnClick);
    // }
  };

  const footerMouseUp = (e: any) => {
    const widthOfLine = Line.current.getBoundingClientRect().width;
    const positionOnClick = e.clientX / widthOfLine;

    Player.current.seekTo(positionOnClick);
    setIsMouseDown(false);
  };

  return (
    <footer
      id="main-footer"
      style={isShowFooter ? styleShowingFooter : {}}
      onMouseDown={footerMouseDown}
      onMouseUp={footerMouseUp}
    >
      <ReactPlayer
        ref={Player}
        onSeek={handleSeek}
        url={currentTrack ? currentTrack.url : ""}
        onPlay={() => setPlaying(true)}
        onEnded={handlePalyingEnd}
        onPause={() => setPlaying(false)}
        onProgress={handleProgress}
        onDuration={handleDuration}
        playing={isPlaying}
        width={0}
        height={0}
      />
      {isShowProgress && (
        <div className="main-footer__progress-liner" ref={Line}>
          <span className="noselect">{runString}</span>
          <button
            style={{
              marginLeft: `${bikeProgress}%`,
              color: isMouseDown ? "gray" : "blueviolet",
              fontSize: isMouseDown ? 38 : 36,
            }}
            onMouseDown={handleBikeMouseDown}
            onMouseUp={handleBikeMouseUp}
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
