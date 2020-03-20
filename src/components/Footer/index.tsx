import * as React from 'react';

import MainContext from '../../context';

import { progressType } from '../../types/progressType';
import { mainContextType } from '../../types/mainContextType';

import './style.scss';

type propsType = {
  // onShowFooter(): void;
  onPlay(): void;
  onNext(): void;
  onPrev(): void;
  onSetSeekPosition(position: number): void;
  runString: string;
  isBlur: boolean;
  isShowing: boolean;
  isPlaying: boolean;
  isReady: boolean;
  progress: progressType;
};

const Footer = ({
  // onShowFooter,
  isBlur,
  isReady,
  isPlaying,
  onPlay,
  onNext,
  onPrev,
  onSetSeekPosition,
  runString,
  isShowing,
  progress,
}: propsType): JSX.Element => {
  const Line = React.useRef();

  const [isLineMouseDown, setIsLineMouseDown] = React.useState(false);
  const [bikePosition, setBikePosition] = React.useState(0);
  const mainContext: mainContextType = React.useContext<mainContextType>(MainContext);

  const bikeSize = 36;

  const handlePlay = (): void => {
    if (isReady) onPlay();
  };
  const handlePrev = (): void => {
    onPrev();
  };
  const handleNext = (): void => {
    onNext();
  };

  // const handleBikePosition = (bikeShift: number): number => {
  //   if (typeof Line !== 'undefined' && Line.current) {
  //     // @ts-ignore:
  //     const widthOfLine = Line.current.getBoundingClientRect().width;

  //     const bikeWidth = bikeSize * 1.25;

  //     const lineWithoutBike = widthOfLine - bikeWidth;

  //     return (bikeShift / 100) * lineWithoutBike;
  //   }
  //   return 0;
  // };

  // const handleProgress = (newProgress: progressType): void => {
  //   setProgress(newProgress);

  //   // setBikeProgress(~~(newProgress.played * 100) || 0);
  //   if (!isLineMouseDown) setBikePosition(handleBikePosition(~~(newProgress.played * 100) || 0));
  // };

  const handleLineMouseDown = (e: any): void => {
    if (e.target.id === 'progress_mover') {
      setIsLineMouseDown(true);
    }
  };

  const handleMouseMove = (e: any): void => {
    // console.log("mouseMove");

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

    onSetSeekPosition(positionOnClick);
    setIsLineMouseDown(false);
  };

  const convertProgressToBikePosition = (): number => {
    return ~~(progress.played * 100) || 0;
  };

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
          <span className="noselect">{runString}</span>
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
              style={{
                marginLeft: bikePosition || 0, //`${bikeProgress}%`,
                color: isLineMouseDown ? 'gray' : 'blueviolet',
                fontSize: isLineMouseDown ? 38 : bikeSize,
              }}
            >
              <i id="progress_mover" className="fas fa-biking"></i>
            </button>
          )}
          <div
            style={
              mainContext.progress && mainContext.progress.loaded
                ? { width: `${mainContext.progress.loaded * 100}%` }
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
