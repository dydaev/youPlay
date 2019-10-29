import * as React from 'react';

// @ts-ignore: Unreachable code error
import ReactPlayer from 'react-player';

import { playItemType } from '../../types/playItemType';
import { progressType } from '../../types/progressType';
import { playStrategicType } from '../../types/playStrategicType';

import './style.scss';
import { log } from 'util';

type propsType = {
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
  const [bikeProgress, setBikeProgress] = React.useState(0);
  const [songLength, setSongLength] = React.useState(0);

  const handlePlay = () => {
    onSavePlay(true);
    onPlay(undefined);
  };
  const handleStop = () => {
    onSavePlay(false);
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
    console.log('====================================');
    console.log(e.clientX, e.target.getBoundingClientRect());
    console.log('====================================');
  };

  return (
    <footer id="main-footer">
      <ReactPlayer
        url={currentTrack ? currentTrack.url : ''}
        onPlay={() => setPlaying(true)}
        onEnded={() => playStrategic !== 'once' && onNext()}
        onPause={() => setPlaying(false)}
        onProgress={handleProgress}
        onDuration={handleDuration}
        playing={isPlaying}
        width={0}
        height={0}
      />
      <div className="main-footer__progress-liner">
        <button style={{ marginLeft: `${bikeProgress}%` }} onMouseMove={handleBikePress}>
          <i className="fas fa-biking"></i>
        </button>
        <div />
      </div>
      <div className="main-footer__control-buttons">
        <button style={{ fontSize: 30 }} onClick={handlePrev}>
          <i className="fas fa-angle-double-left"></i>
        </button>
        <button onClick={handlePlay}>
          <i className={isPlaying ? 'fas fa-pause' : 'fas fa-play'}></i>
        </button>
        <button onClick={handleStop}>
          <i className="fas fa-stop"></i>
        </button>
        <button style={{ fontSize: 30 }} onClick={handleNext}>
          <i className="fas fa-angle-double-right"></i>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
