import * as React from 'react';
import MainContext from '../../context';

import Background from '../background/index';
import ProgressLine from '../ProgressLine/index';

import { bodyType } from '../../types/bodyType';
import { playItemType } from '../../types/playItemType';
import { mainContextType } from '../../types/mainContextType';

// import { playItem } from '../../models/playItem';

import './style.scss';

type propsType = {
  onPlay(trackNumber: number): void;
  onSetCurrentTrack(trackNumber: number): void;
  onClose(type: bodyType): void;
};

const PlayList = ({
  onPlay,
}: //   onSetCurrentTrack,
//   onClose,
propsType): any => {
  const mainContext: mainContextType = React.useContext<mainContextType>(MainContext);

  const handlePlay = (track: number): void => {
    onPlay(track);
  };

  const download = (url: string, trackName: string, e: any): void => {
    e.preventDefault();
    const fileId = url.replace(/^.*v=/, '');
    const downloadingUrl = `${mainContext.settings.downloadServer}/downloading/${fileId}`;
    fetch(downloadingUrl, { method: 'POST' })
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${trackName}.webm`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(e => console.log('Cannt downloading track.', e));
  };

  return (
    <>
      {/* <Background count={0} /> */}
      <div
        style={{ overflow: 'scroll', flexShrink: 10, overflowX: 'hidden' /*, height: "100%" */ }}
      >
        <ul className="main-component_play-list">
          {Array.isArray(mainContext.playList) ? (
            mainContext.playList.map((playItem: playItemType, index: number): any => (
              <li key={'listOfTracks' + index.toString()} onClick={(): void => handlePlay(index)}>
                <img
                  style={{ width: 85 }}
                  src={
                    playItem.image ||
                    'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image'
                  }
                  alt="placeholder+image"
                />
                {index !== mainContext.currentTrackNumber ? (
                  <div>
                    <p>
                      <span style={{ color: 'darksalmon' }}>{playItem.artist}</span>
                      <span>{playItem.title}</span>
                    </p>
                    <span>{playItem.length}</span>
                  </div>
                ) : (
                  <div>
                    <ProgressLine
                      color="gray"
                      filling={mainContext.progress.played * 100}
                      invert={true}
                    />
                    <ProgressLine
                      color="gray"
                      height={2}
                      filling={mainContext.progress.loaded * 100}
                    />

                    <p>
                      <span style={{ color: 'darksalmon' }}>{playItem.artist}</span>
                      <span>{playItem.title}</span>
                    </p>
                    <span>{playItem.length}</span>
                  </div>
                )}
                {mainContext.settings.directYoutubeLoad && (
                  <img
                    style={{
                      position: 'absolute',
                      height: 50,
                      width: 50,
                      top: '50%',
                      right: 0,
                      padding: 10,
                      transform: 'translate(-15%, -50%)',
                      opacity: 0.3,
                    }}
                    onClick={(e): void => download(playItem.url, playItem.title, e)}
                    src={
                      process.env.NODE_ENV == 'development'
                        ? '../../img/download.png'
                        : 'img/download.png'
                    }
                  />
                )}
              </li>
            ))
          ) : (
            <li>Play list is empty, pleas add or chose playlist in manager</li>
          )}
        </ul>
      </div>
    </>
  );
};

export default PlayList;
