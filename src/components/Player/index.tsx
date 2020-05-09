import * as React from 'react';

import * as axios from 'axios';
import ReactPlayer from 'react-player';

import { IPlayItemTypeV2 } from '../../types/playItemType';

import MainContext from '../../context';

import { IMainContextType } from '../../types/mainContextType';

import { progressType } from '../../types/progressType';
import Swiper from '../Swiper';
import Shield from './Shield';

import './style.scss';

const getUrlFromId = (id: string, serverAddress: string, forBackServer: boolean): string => {
  return forBackServer
    ? `${serverAddress}/getTrackPath/${id}`
    : `https://www.youtube.com/watch?v=${id}`;
};

export interface IPropsType {
  isBlur: boolean;
  isPlay: boolean;
  isShowHeader: boolean;
  track: IPlayItemTypeV2;
  ref: any;
  onTrackEnded(): void;
  onTogglePlaylist(): void;
  onToggleHeaderAndFooter(): void;
  onSetReady(stateOfReady: boolean): void;
  onProgress(newProgress: progressType): void;
  onDuration(newDuration: number): void;
  onPlay(): void;
  onNext(): void;
  onPrev(): void;
}

const Player: React.ComponentType<IPropsType> = React.forwardRef(
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
    }: IPropsType,
    ref: any,
  ) => {
    const context: IMainContextType = React.useContext(MainContext);
    const PlayerBack = React.useRef(null);

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

    const handleSwipe = (dir: 'up' | 'down' | 'left' | 'right'): void => {
      if (dir === 'up') onToggleHeaderAndFooter();

      if (dir === 'down')
        if (isShowHeader) onTogglePlaylist();
        else onToggleHeaderAndFooter();

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
    // console.log(track, context.settings.downloadServer, !context.settings.showVideo);

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
          url={
            track && track.id
              ? getUrlFromId(track.id, context.settings.downloadServer, !context.settings.showVideo)
              : ''
          }
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
