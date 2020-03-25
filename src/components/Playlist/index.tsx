import * as React from 'react';

import './style.scss';
import { playItemType } from '../../types/playItemType';
import { notShowStyle } from '../Manager/index';

export interface PlaylistProps {
  onSetCurrentTrackNumber(newTrackNumber: number): void;
  playlist: playItemType[];
  selectedTrackNumber: number;
  isShow: boolean;
}

export const Playlist: React.FunctionComponent<PlaylistProps> = ({
  isShow,
  playlist,
  onSetCurrentTrackNumber,
  selectedTrackNumber,
}: PlaylistProps) => (
  <div style={isShow ? {} : notShowStyle}>
    <table className="top-list">
      <tbody>
        {playlist.map(
          (playItem: playItemType, index: number): React.ReactNode => (
            <tr
              key={'playlistItem-' + index}
              onClick={(): void => onSetCurrentTrackNumber(index)}
              className={index === selectedTrackNumber ? 'top-list_row select-row' : 'top-list_row'}
            >
              <td>
                <span>{index + 1}</span>
              </td>
              <td>
                <img src={playItem.image} alt="track Image" />
              </td>
              <td className="top-list_top-list_row_track-name">
                <p>{playItem.title}</p>
              </td>
            </tr>
          ),
        )}
      </tbody>
    </table>
  </div>
);
