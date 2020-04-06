import * as React from 'react';

import ReactPlayer from 'react-player';
import * as axios from 'axios';
// const axios = require('axios');

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
    const [trackUrl, setTrackUrl] = React.useState(track && track.url ? track.url : '');

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

    const handleSetTrackUrl = (newUrl: string): void => {
      if (newUrl !== trackUrl) setTrackUrl(newUrl);
    };

    const getTrackFromServer = (): void => {
      const trackUrl = track && track.url ? track.url.replace(/&.*/, '') : '';
      const trackID = trackUrl.replace(/^.*v=/, '');

      if (context.settings.directYoutubeLoad && trackID) {
        // @ts-ignore
        axios(`${context.settings.downloadServer}/getTrackPath/${trackID}`)
          .then((res: any) => {
            if (res.statusText === 'OK') {
              const answerArr = res.data.split(' '); // answer: downloaded track/path, or downloading track/path
              if (answerArr[0] === 'downloaded') {
                handleSetTrackUrl(`${context.settings.downloadServer}/${answerArr[1]}`);
              } else if (answerArr[0] === 'downloading') {
                setTimeout(() => {
                  handleSetTrackUrl(`${context.settings.downloadServer}/${answerArr[1]}`);
                }, 500);
              }
            }
          })
          .catch((error: any) => {
            handleSetTrackUrl(trackUrl);
            context.showMessage({
              text: 'Download server isn`t found. Use youtube!!!',
              type: 'WARNING',
            });
            console.error('Ошибка HTTP: ' + error);
          });
      } else {
        handleSetTrackUrl(trackUrl);
      }
    };

    React.useEffect((): void => {
      if (context.settings.directYoutubeLoad) getTrackFromServer();
      else if (track) handleSetTrackUrl(track.url);
    });

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
          url={trackUrl}
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
