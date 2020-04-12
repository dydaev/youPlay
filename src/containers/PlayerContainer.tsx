import * as React from 'react';

import Footer from '../components/Footer';
import Player from '../components/Player';

import { progressType } from '../types/progressType';
import { playItemType } from '../types/playItemType';
import { progressModel } from '../models/progressModel';

interface PlayerContainerProps {
  // onShowFooter(): void;
  ref: any;
  //   playerRef: any;
  isBlur: boolean;
  isPlay: boolean;
  isReady: boolean;
  isShowing: boolean;
  isPlaying: boolean;
  trackTitle: string;
  track: playItemType;
  isBlurTitle: boolean;
  onPlay(): void;
  onNext(): void;
  onPrev(): void;
  onTrackEnded(): void;
  onSetReady(stateOfReady: boolean): void;
}

const PlayerContainer: React.FunctionComponent<PlayerContainerProps> = props => {
  const playerRef = React.useRef<any>();
  const [duration, setDuration] = React.useState(0);
  const [progress, setProgress] = React.useState<progressType>(progressModel);
  const [moverPosition, setMoverPosition] = React.useState(0);

  const handleProgress = (newProgress: progressType): void => {
    setProgress(newProgress);
  };

  const handleDuration = (newDuration: number): void => {
    if (duration !== newDuration) setDuration(newDuration);
  };

  const handleSetMoverPosition = (position: number): void => {
    setMoverPosition(position);
  };

  const handleSetSeek = (position: number): void => {
    if (playerRef && playerRef.current) playerRef.current.seekTo(position);
  };

  return (
    <>
      <Player {...props} onProgress={handleProgress} onDuration={handleDuration} ref={playerRef} />
      <Footer
        {...props}
        isBlur={false}
        onSetSeek={handleSetSeek}
        progress={progress}
        duration={duration}
        moverPosition={moverPosition}
        onSetMoverPosition={handleSetMoverPosition}
      />
    </>
  );
};

export default PlayerContainer;
