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
  isMinimize: boolean;
  currentTrack: playItemType;
  currentTrackNumber: number;
  playList: playItemType[];
  playStrategic: playStrategicType;
  setPlaying(arg: boolean): void;
  onSavePlay(arg: boolean): void;
  setDuration(newDuration: number): void;
  setProgress(newProgress: progressType): void;
  onToogleMinimize(): void;
  onPlay(trackNumber: number): void;
  onStop(): void;
  onPrev(): void;
  onNext(): void;
  onShowFooter(): void;
};

const Footer = ({
  playList,
  currentTrackNumber,
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
  onToogleMinimize,
  isMinimize,
  onShowFooter,
}: propsType) => {
  const Player = React.useRef(null);
  const Line = React.useRef(null);
  const Shield = React.useRef(null);

  React.useEffect(() => {
    // console.log(Player.current);
  });

  const [playId, setPlayId] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [isPlayReady, setIsPlayReady] = React.useState(false);
  const [sliderStyle, setSliderStyle] = React.useState({});
  const [positionStartFlipMouseDown, setPositionStartFlipMouseDown] = React.useState({
    x: 0,
    y: 0,
  });
  const [isLineMouseDown, setIsLineMouseDown] = React.useState(false);
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
    if (Line && Line.current) {
      const widthOfLine = Line.current.getBoundingClientRect().width;

      const bikeWidth = bikeSize * 1.25;

      const lineWithoutBike = widthOfLine - bikeWidth;

      return (bikeShift / 100) * lineWithoutBike;
    }
    return 0;
  };

  const handleDuration = (newDuration: number): void => {
    setSongLength(newDuration);
    setDuration(newDuration);
  };

  const handleProgress = (newProgress: progressType): void => {
    setProgress(newProgress);

    // setBikeProgress(~~(newProgress.played * 100) || 0);
    if (!isLineMouseDown) setBikePosition(handleBikePosition(~~(newProgress.played * 100) || 0));
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
    height: mainContext.settings.showVideo ? "100%" : undefined,
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
      setIsLineMouseDown(true);
    }
  };

  const handleMouseMove = (e: any) => {
    // console.log("mouseMove");

    if (isLineMouseDown) {
      const x = typeof e.touches === "object" ? e.touches[0].clientX : e.clientX;
      setBikePosition(x - bikeSize / 2);
    }
    if (positionStartFlipMouseDown.x || positionStartFlipMouseDown.y) {
      const thresholdOfShift = 25;

      const widthOfShield = Shield.current.getBoundingClientRect().width;
      const heightOfShield = Shield.current.getBoundingClientRect().height;

      const x = typeof e.changedTouches === "object" ? e.changedTouches[0].clientX : e.clientX;
      const y = typeof e.changedTouches === "object" ? e.changedTouches[0].clientY : e.clientY;

      const mousePosition = {
        x: x,
        y: y,
      };
      const mouseStartPosition = {
        x: positionStartFlipMouseDown.x,
        y: positionStartFlipMouseDown.y,
      };

      const mouseShiftPosition = {
        x: mousePosition.x - mouseStartPosition.x,
        y: mousePosition.y - mouseStartPosition.y,
      };

      if (
        (mouseShiftPosition.x > 0 && mouseShiftPosition.x > mouseShiftPosition.y) ||
        (mouseShiftPosition.x < 0 && mouseShiftPosition.x < mouseShiftPosition.y)
      ) {
        if (mouseShiftPosition.x > thresholdOfShift) {
          setSliderStyle({
            marginLeft: mouseShiftPosition.x,
            background: "blue",
            opacity: mouseShiftPosition.x / 500,
          });
        } else if (mouseShiftPosition.x < thresholdOfShift * -1) {
          setSliderStyle({
            marginRight: mouseShiftPosition.x * -1,
            background: "red",
            opacity: (mouseShiftPosition.x * -1) / 500,
          });
        }
      }
    }
  };

  const handleLineMouseUp = (e: any) => {
    const widthOfLine = Line.current.getBoundingClientRect().width;
    const x = typeof e.changedTouches === "object" ? e.changedTouches[0].clientX : e.clientX;
    const positionOnClick = x / widthOfLine;

    Player.current.seekTo(positionOnClick);
    setIsLineMouseDown(false);
    setSliderStyle({});
    setPositionStartFlipMouseDown({ x: 0, y: 0 });
  };

  const handleFlipMouseDown = (e: any) => {
    if (e.target.id === "yout_shield") {
      const widthOfShield = Shield.current.getBoundingClientRect().width;
      const heightOfShield = Shield.current.getBoundingClientRect().height;
      const x = typeof e.changedTouches === "object" ? e.changedTouches[0].clientX : e.clientX;
      const y = typeof e.changedTouches === "object" ? e.changedTouches[0].clientY : e.clientY;
      const positionOnClick = { x: x, y: y };
      setPositionStartFlipMouseDown(positionOnClick);
    }
  };

  const handleFlipMouseUp = (e: any) => {
    if (e.target.id === "yout_shield") {
      const thresholdOfShift = 50;

      const widthOfShield = Shield.current.getBoundingClientRect().width;
      const heightOfShield = Shield.current.getBoundingClientRect().height;

      const x = typeof e.changedTouches === "object" ? e.changedTouches[0].clientX : e.clientX;
      const y = typeof e.changedTouches === "object" ? e.changedTouches[0].clientY : e.clientY;

      const mousePosition = {
        x: x,
        y: y,
      };
      const mouseStartPosition = {
        x: positionStartFlipMouseDown.x,
        y: positionStartFlipMouseDown.y,
      };

      const mouseShiftPosition = {
        x: mousePosition.x - mouseStartPosition.x,
        y: mousePosition.y - mouseStartPosition.y,
      };

      if (mouseShiftPosition.x < thresholdOfShift * -1) {
        onNext();
      } else if (mouseShiftPosition.x > thresholdOfShift) {
        onPrev();
      } else if (
        mouseShiftPosition.y > thresholdOfShift ||
        mouseShiftPosition.y < thresholdOfShift * -1
      ) {
        handleShowFooter();
      } else if (
        mouseShiftPosition.x <= thresholdOfShift &&
        mouseShiftPosition.x >= thresholdOfShift * -1 &&
        (mouseShiftPosition.y <= thresholdOfShift || mouseShiftPosition.y >= thresholdOfShift * -1)
      ) {
        handlePlay();
      }

      setPositionStartFlipMouseDown({ x: 0, y: 0 });
    }
    setSliderStyle({});
  };

  const handleShowFooter = () => {
    onShowFooter();
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

  const handleError = (e: any) => {
    console.log("error of plaing", e);
    onNext();
  };

  const changeUrl = (newUrl: string) => {
    if (url !== newUrl) {
      setUrl(newUrl);
      // console.log("changed url", url);
    }
  };

  const changePlayId = (newPlayId: string) => {
    if (playId !== newPlayId) {
      setPlayId(newPlayId);
    }
  };

  (() => {
    const trackUrl = currentTrack && currentTrack.url ? currentTrack.url.replace(/&.*/, "") : "";
    const trackID = trackUrl.replace(/^.*v=/, ""); //deleting https://www.youtube.com/watch?v=

    if (playId !== trackID) {
      changePlayId(trackID);
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
              const answerArr = res.data.split(" "); // answer: downloaded track/path, or downloading track/path
              if (answerArr[0] === "downloaded") {
                changeUrl(`${mainContext.settings.downloadServer}/${answerArr[1]}`);
              } else if (answerArr[0] === "downloading") {
                setTimeout(() => {
                  changeUrl(`${mainContext.settings.downloadServer}/${answerArr[1]}`);
                }, 500);
              }
            }
          })
          .catch((error: any) => {
            changeUrl(trackUrl);
            mainContext.showMessage({
              text: "Download server isn`t found. Use youtube!!!",
              type: "WARNING",
            });
            console.error("Ошибка HTTP: " + error);
          });
      } else {
        changeUrl(trackUrl);
      }
    }
  })();

  let numberOfPrevTrack = NaN;
  let numberOfNextTrack = NaN;

  if (playList.length) {
    numberOfPrevTrack = currentTrackNumber > 0 ? currentTrackNumber - 1 : playList.length;
    numberOfNextTrack = currentTrackNumber < playList.length - 1 ? currentTrackNumber + 1 : 0;
  }

  return (
    <footer id="main-footer" onMouseMove={handleMouseMove} onTouchMove={handleMouseMove}>
      {/.+youtube\.com.*/.test(url) && !mainContext.settings.showVideo && (
        <img
          style={{
            position: "fixed",
            width: "20%",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0.3,
          }}
          src={
            process.env.NODE_ENV == "development"
              ? "../../img/youtube_dark.png"
              : "img/youtube_dark.png"
          }
        />
      )}
      <div
        ref={Shield}
        id="yout_shield"
        className="main-footer_yout-shield"
        onMouseDown={handleFlipMouseDown}
        onMouseUp={handleFlipMouseUp}
        onTouchStart={handleFlipMouseDown}
        onTouchEnd={handleFlipMouseUp}
      />
      {playList.length && (
        <img
          className="main-footer_slider"
          style={{ left: "-100%", ...sliderStyle }}
          src={
            typeof playList[numberOfPrevTrack] !== "undefined"
              ? playList[numberOfPrevTrack].image
              : null
          }
        />
      )}
      {playList.length && (
        <img
          className="main-footer_slider"
          style={{ right: "-100%", ...sliderStyle }}
          src={
            typeof playList[numberOfNextTrack] !== "undefined"
              ? playList[numberOfNextTrack].image
              : null
          }
        />
      )}
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
        width={mainContext.settings.showVideo ? "100%" : 0}
        height={mainContext.settings.showVideo ? "100%" : 0}
        style={{ position: "fixed", top: 0 }}
      />
      <MediaSession
        title={runString}
        artist="Renat"
        onPlay={() => {
          console.log("use key play");
          handlePlay();
        }}
        onPause={() => handleStop()}
        onPreviousTrack={() => handlePrev()}
        onNextTrack={() => handleNext()}
      />
      <div className="main-footer_hider" style={isShowFooter ? { bottom: 0 } : {}}>
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
                color: isLineMouseDown ? "gray" : "blueviolet",
                fontSize: isLineMouseDown ? 38 : bikeSize,
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
      </div>
    </footer>
  );
};

export default Footer;
