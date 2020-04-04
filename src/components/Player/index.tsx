import * as React from 'react';

import ReactPlayer from 'react-player';

import { playItemType } from '../../types/playItemType';

import MainContext from '../../context';

import { mainContextType } from '../../types/mainContextType';

import './style.scss';

export type propsType = {
  isBlur: boolean;
  isPlay: boolean;
  onTrackEnded(): void;
  track: playItemType;
  ref: any;
  onSetReady(stateOfReady: boolean): void;
};

// eslint-disable-next-line react/display-name
const Player: React.ComponentType<propsType> = React.forwardRef(
  ({ isPlay, track, onSetReady, isBlur, onTrackEnded }: propsType, ref: any) => {
    const context: mainContextType = React.useContext(MainContext);
    const PlayerBack = React.useRef(null);
    // const PlayerSelf = React.useRef(null);
    // const [, setPlaying] = React.useState(false);

    const handleErr = (err: any): void => {
      console.log('Cannt play track.', err);
    };

    const handleReady = (): void => {
      onSetReady(true);
    };
    const handlePlayingEnded = (): void => {
      onSetReady(false);
      onTrackEnded();
    };

    return (
      <div
        className={isBlur ? 'base-component_player is_blur' : 'base-component_player'}
        ref={PlayerBack}
      >
        <ReactPlayer
          config={{
            youtube: {
              playerVars: { showinfo: 0 },
            },
          }}
          ref={ref}
          onError={handleErr}
          url={track && track.url ? track.url : ''}
          playing={isPlay}
          onReady={handleReady}
          onEnded={handlePlayingEnded}
          volume={context.settings.volume}
          // onStart={handleStartPlay}
          // onSeek={handleSeek}
          // onPlay={handlePlayerPlay}
          // onPause={() => setPlaying(false)}
          // onProgress={handleProgress}
          // onDuration={handleDuration}
          width={'100%'}
          height={'100%'}
          style={{ position: 'fixed', top: 0 }}
        />
        <div className="base-component_player__album-image">
          <img
            src="https://i.pinimg.com/236x/bd/37/e8/bd37e8d4447f60ef28f949cbc73fe3da.jpg"
            alt="album image"
          />
        </div>
      </div>
    );
  },
);

export default Player;
