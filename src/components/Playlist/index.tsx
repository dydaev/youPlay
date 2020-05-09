import * as React from 'react';

import { IPlayItemTypeV2 } from '../../types/playItemType';
import { notShowStyle } from '../Manager/index';

import MainContext from '../../context';
import { IMainContextType } from '../../types/mainContextType';
import Swiper from '../Swiper';
import PlaylistItem from './PlaylistItem';

import './style.scss';

export interface IPlaylistProps {
  isShow: boolean;
  isShowTopList: boolean;
  // onGetTrackInfoFromServer(url: string): Promise<IPlayItemTypeV2 | void>;
  onSetCurrentTrackNumber(newTrackNumber: number): void;
}

export const Playlist: React.FunctionComponent<IPlaylistProps> = ({
  isShow,
  isShowTopList,
  onSetCurrentTrackNumber,
}: // onGetTrackInfoFromServer,
IPlaylistProps) => {
  const mainContext: IMainContextType = React.useContext<IMainContextType>(MainContext);

  // const handleUpdatePlaylist = () => {
  //   mainContext.playList
  // }

  const download = 0;

  return (
    <div style={isShow ? {} : notShowStyle}>
      <table className="top-list">
        <tbody>
          {mainContext.playList.map(
            (playItem: IPlayItemTypeV2, index: number): React.ReactNode => (
              <tr
                key={'playlistItem-' + index}
                onClick={(): void => {
                  if (playItem.readiness === 100) onSetCurrentTrackNumber(index);
                }}
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
                  <img
                    style={
                      !mainContext.settings.showVideo && playItem.readiness < 100
                        ? { opacity: 0.2 }
                        : {}
                    }
                    src={playItem.image}
                    alt="track Image"
                  />
                </td>
                <td className="top-list_top-list_row_track-name">
                  <Swiper>
                    <PlaylistItem
                      isShowingPlaylist={isShow}
                      index={index}
                      playItem={playItem}
                      setCloseTools={!isShow || !isShowTopList}
                      onSelect={playItem.readiness === 100 ? onSetCurrentTrackNumber : () => 0}
                    />
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
