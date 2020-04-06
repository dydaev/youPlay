import * as React from 'react';

import './style.scss';
import { playItemType } from '../../types/playItemType';
import { notShowStyle } from '../Manager/index';

import { mainContextType } from '../../types/mainContextType';
import MainContext from '../../context';
import Swiper from '../Swiper';
import PlaylistItem from './PlaylistItem';

export interface PlaylistProps {
  isShowTopList: boolean;
  onSetCurrentTrackNumber(newTrackNumber: number): void;
  isShow: boolean;
}

export const Playlist: React.FunctionComponent<PlaylistProps> = ({
  isShow,
  isShowTopList,
  onSetCurrentTrackNumber,
}: PlaylistProps) => {
  const mainContext: mainContextType = React.useContext<mainContextType>(MainContext);
  return (
    <div style={isShow ? {} : notShowStyle}>
      <table className="top-list">
        <tbody>
          {mainContext.playList.map(
            (playItem: playItemType, index: number): React.ReactNode => (
              <tr
                key={'playlistItem-' + index}
                onClick={(): void => onSetCurrentTrackNumber(index)}
                className={
                  index === mainContext.currentTrackNumber
                    ? 'top-list_row select-row'
                    : 'top-list_row'
                }
              >
                <td>
                  <span>{index + 1}</span>
                </td>
                <td>
                  <img src={playItem.image} alt="track Image" />
                </td>
                <td className="top-list_top-list_row_track-name">
                  <Swiper onClick={(): void => onSetCurrentTrackNumber(index)}>
                    <PlaylistItem playItem={playItem} setCloseTools={!isShow || !isShowTopList} />
                  </Swiper>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
};
