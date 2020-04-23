import * as React from 'react';

import MainContext from '../../context';

import { progressType } from '../../types/progressType';
import { mainContextType } from '../../types/mainContextType';

import './style.scss';
import lib from '../../lib';

type propsType = {
  // onShowFooter(): void;
  onPlay(): void;
  onNext(): void;
  onPrev(): void;
  onSetSeek(position: number): void;
  onSetMoverPosition(position: number): void;
  trackTitle: string;
  isBlur: boolean;
  isBlurTitle: boolean;
  isShowing: boolean;
  isPlaying: boolean;
  isReady: boolean;
  duration: number;
  moverPosition: number;
  progress: progressType;
};

const Footer = ({
  // onShowFooter,
  onSetSeek,
  isBlur,
  isBlurTitle,
  isReady,
  isPlaying,
  onPlay,
  onNext,
  moverPosition,
  onPrev,
  duration,
  onSetMoverPosition,
  trackTitle,
  isShowing,
  progress,
}: propsType): JSX.Element => {
  const Line = React.useRef();

  const [isLineMouseDown, setIsLineMouseDown] = React.useState(false);
  const [bikePosition, setBikePosition] = React.useState(moverPosition);
  const mainContext: mainContextType = React.useContext<mainContextType>(MainContext);

  const bikeSize = 36;

  const handlePlay = (): void => {
    if (isReady) onPlay();
  };
  const handlePrev = (): void => {
    onPrev();
  };
  const handleNext = (): void => {
    console.log(mainContext);

    onNext();
  };

  const calculatePosition = (bikeShift: number): number => {
    if (typeof Line !== 'undefined' && Line.current) {
      // @ts-ignore:
      const widthOfLine = Line.current.getBoundingClientRect().width;

      const bikeWidth = bikeSize * 1.25;

      const lineWithoutBike = widthOfLine - bikeWidth;

      return (bikeShift / 100) * lineWithoutBike;
    }
    return 0;
  };

  const handleLineMouseDown = (e: any): void => {
    if (e.target.id === 'progress_mover') {
      setIsLineMouseDown(true);
    }
  };

  const handleMouseMove = (e: any): void => {
    if (isLineMouseDown) {
      const x = typeof e.touches === 'object' ? e.touches[0].clientX : e.clientX;
      setBikePosition(x - bikeSize / 2);
    }
  };

  const handleLineMouseUp = (e: any): void => {
    // @ts-ignore:
    const widthOfLine = Line.current.getBoundingClientRect().width;
    const x = typeof e.changedTouches === 'object' ? e.changedTouches[0].clientX : e.clientX;
    const positionOnClick = x / widthOfLine;

    onSetMoverPosition(positionOnClick);
    onSetSeek(positionOnClick);
    setIsLineMouseDown(false);
  };

  React.useEffect((): void => {
    if (!isLineMouseDown) {
      const moverProgressPosition = calculatePosition(~~(progress.played * 100) || 0);
      if (moverProgressPosition !== bikePosition) setBikePosition(moverProgressPosition);
    }
  });

  let title = '';
  let warning = false;

  if (mainContext.listOfPlaylist && !mainContext.listOfPlaylist.length) {
    title = 'Please add playlist in manager';
    warning = true;
  } else if (
    mainContext.listOfPlaylist &&
    mainContext.listOfPlaylist.length &&
    Number.isNaN(mainContext.currentPlaylistNumber)
  ) {
    title = 'Please select playlist in manager';
    warning = true;
  } else {
    if (mainContext.playList && !mainContext.playList.length) {
      title = 'Playlist is empty, please try update playlist or check playlist in youtube';
      warning = true;
    } else if (
      mainContext.playList &&
      mainContext.playList.length &&
      Number.isNaN(mainContext.currentTrackNumber)
    ) {
      title = 'Playlist select track for playing';
      warning = true;
    } else if (Math.floor(duration)) {
      title = `${trackTitle || ''} (${lib.seconds2time(Math.floor(duration))})`;
    } else {
      title = trackTitle || '';
    }
  }

  return (
    <footer
      id="main-footer"
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      className={isBlur ? 'is_blur' : ''}
      style={isShowing ? { bottom: 0 } : {}}
    >
      {isShowing && (
        <div
          className="main-footer__progress-liner"
          onMouseDown={handleLineMouseDown}
          onMouseUp={handleLineMouseUp}
          onTouchStart={handleLineMouseDown}
          onTouchEnd={handleLineMouseUp}
          ref={Line}
        >
          <span
            className={isBlurTitle ? 'noselect is_blur2' : 'noselect'}
            style={warning ? { color: 'orange' } : {}}
          >
            {title}
          </span>
          <div
            style={{
              zIndex: 0,
              top: -40,
              height: 40,
              width: '100%',
              position: 'absolute',
              background: 'none',
            }}
          />
          {isReady && (
            <button
              className={isBlurTitle ? 'is_blur2' : ''}
              style={{
                marginLeft: bikePosition || 0, //`${bikeProgress}%`,
                color: isLineMouseDown ? 'gray' : 'blueviolet',
                fontSize: isLineMouseDown ? 38 : bikeSize,
                transition: isLineMouseDown || bikePosition === 0 ? 'unset' : 'margin-left 2s',
              }}
            >
              <i id="progress_mover" className="fas fa-biking"></i>
            </button>
          )}
          <div
            style={
              progress && progress.loaded
                ? { width: `${progress.loaded * 100}%` }
                : { background: 'lightgray' }
            }
          />
        </div>
      )}
      <div className="main-footer__control-buttons">
        <button style={{ fontSize: 40 }} onClick={handlePrev}>
          <i className="fas fa-angle-double-left"></i>
        </button>
        <button onClick={handlePlay}>
          <i className={isPlaying ? 'fas fa-pause' : 'fas fa-biking'}></i>
        </button>
        <button style={{ fontSize: 40 }} onClick={handleNext}>
          <i className="fas fa-angle-double-right"></i>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
