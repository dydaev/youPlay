import * as React from 'react';

import Footer from '../components/Footer';
import Player from '../components/Player';

import { progressModel } from '../models/progressModel';
import { playItemType } from '../types/playItemType';
import { progressType } from '../types/progressType';

interface IPlayerContainerProps {
  // onShowFooter(): void;
  //   playerRef: any;
  ref: any;
  isBlur: boolean;
  isPlay: boolean;
  isReady: boolean;
  isShowing: boolean;
  isPlaying: boolean;
  trackTitle: string;
  track: playItemType;
  isShowHeader: boolean;
  isBlurTitle: boolean;
  onPlay(): void;
  onNext(): void;
  onPrev(): void;
  onTrackEnded(): void;
  onTogglePlaylist(): void;
  onToggleHeaderAndFooter(): void;
  onSetReady(stateOfReady: boolean): void;
}

const PlayerContainer: React.FunctionComponent<IPlayerContainerProps> = React.forwardRef(
  (props, ref) => {
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
        <Player
          {...props}
          onProgress={handleProgress}
          onDuration={handleDuration}
          ref={playerRef}
          isShowHeader={props.isShowHeader}
          onTogglePlaylist={props.onTogglePlaylist}
          onToggleHeaderAndFooter={props.onToggleHeaderAndFooter}
        />
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
  },
);

export default PlayerContainer;
