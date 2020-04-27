import * as React from 'react';

import ReactPlayer from 'react-player';
import * as axios from 'axios';

import { playItemType } from '../../types/playItemType';

import MainContext from '../../context';

import { mainContextType } from '../../types/mainContextType';

import './style.scss';
import { progressType } from '../../types/progressType';
import Swiper from '../Swiper';
import Shield from './Shield';

export type propsType = {
  isBlur: boolean;
  isPlay: boolean;
  isShowHeader: boolean;
  onTrackEnded(): void;
  track: playItemType;
  ref: any;
  onTogglePlaylist(): void;
  onToggleHeaderAndFooter(): void;
  onSetReady(stateOfReady: boolean): void;
  onProgress(newProgress: progressType): void;
  onDuration(newDuration: number): void;
  onPlay(): void;
  onNext(): void;
  onPrev(): void;
};
// eslint-disable-next-line react/display-name
const Player: React.ComponentType<propsType> = React.forwardRef(
  (
    {
      isPlay,
      onPlay,
      onNext,
      onPrev,
      track,
      isBlur,
      isShowHeader,
      onSetReady,
      onProgress,
      onDuration,
      onTrackEnded,
      onTogglePlaylist,
      onToggleHeaderAndFooter,
    }: propsType,
    ref: any,
  ) => {
    const context: mainContextType = React.useContext(MainContext);
    const PlayerBack = React.useRef(null);
    const [trackUrl, setTrackUrl] = React.useState(track && track.url ? track.url : '');

    const handleErr = (err: any): void => {
      context.showMessage({ text: 'Cannt play track: ' + track.title, type: 'WARNING' });
      console.warn('Cannt play track.', err);
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

    const handleSwipe = (dir: 'up' | 'down' | 'left' | 'right'): void => {
      if (dir === 'up') onToggleHeaderAndFooter();

      if (dir === 'down') {
        if (isShowHeader) onTogglePlaylist();
        else onToggleHeaderAndFooter();
      }

      if (dir === 'right') onPrev();
      if (dir === 'left') onNext();
    };

    const handleClickSwiper = (): void => {
      const controlContainerElement = document.querySelector(
        '.base-component_volume-control_control-container',
      );

      if (controlContainerElement) {
        // @ts-ignore
        const height = window
          .getComputedStyle(controlContainerElement, null)
          .getPropertyValue('height');

        // tslint:disable-next-line:radix
        const volumControllIsClosed: boolean = !parseInt(height);

        if (volumControllIsClosed) onPlay();
      }
    };

    React.useEffect((): void => {
      if (context.settings.directYoutubeLoad && !context.settings.showVideo) getTrackFromServer();
      else if (track) handleSetTrackUrl(track.url);
    });

    return (
      <div
        className={isBlur ? 'base-component_player is_blur' : 'base-component_player'}
        ref={PlayerBack}
      >
        <Swiper onSwipe={handleSwipe} onClick={handleClickSwiper}>
          <Shield />
        </Swiper>
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
          onProgress={onProgress}
          onDuration={onDuration}
          width={'100%'}
          height={'100%'}
          style={{ position: 'fixed', top: 0 }}
        />
        <div className="base-component_player__album-image">
          <img
            src={
              track && track.image
                ? track.image
                : 'https://i.pinimg.com/236x/bd/37/e8/bd37e8d4447f60ef28f949cbc73fe3da.jpg'
            }
            alt="album image"
          />
        </div>
      </div>
    );
  },
);

export default Player;
