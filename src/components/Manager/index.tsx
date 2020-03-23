import * as React from 'react';
import { listOfPlaylistItemType } from '../../types/listOfPlaylistItemType';

import './style.scss';

export interface ManagerProps {
  isShow: boolean;
  selectedPlaylist: number;
  playlists: listOfPlaylistItemType[];
  onSetCurrentPlaylistNumber(selectedPlaylistIndex: number): void;
}

export const notShowStyle = {
  margin: 0,
  padding: 0,
  width: 0,
  display: 'block',
};

export const Manager: React.FunctionComponent<ManagerProps> = ({
  isShow,
  playlists,
  onSetCurrentPlaylistNumber,
  selectedPlaylist,
}: ManagerProps) => {
  const [showAddForm, setShowAddForm] = React.useState(false);

  const handleClickAddButton = (): void => {
    if (!showAddForm) {
      setShowAddForm(!showAddForm);
    } else {
      console.log('save form');
      setShowAddForm(!showAddForm);
    }
  };
  const handleClearAddForm = (): void => {
    console.log('clear form');
    setShowAddForm(false);
  };

  return (
    <div style={isShow ? {} : notShowStyle}>
      <table className="top-list">
        <tbody>
          {playlists.map(
            (playlist: listOfPlaylistItemType, index: number): React.ReactNode => (
              <tr
                key={'playlistItem-' + index}
                onClick={(): void => onSetCurrentPlaylistNumber(index)}
                className={index === selectedPlaylist ? 'top-list_row select-row' : 'top-list_row'}
              >
                <td>
                  <span>{index + 1}</span>
                </td>
                <td>
                  <p>{playlist.name}</p>
                  <p>{playlist.description || ''}</p>
                </td>
              </tr>
            ),
          )}
          {showAddForm && (
            <tr className="top-list_row top-list_row-add">
              <td>{playlists.length ? playlists.length + 1 : 1}</td>
              <td>
                <input type="text" placeholder="URL" />
                <input type="text" placeholder="Name" />
                <input type="text" placeholder="Description" />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button style={isShow && !showAddForm ? {} : { right: -155 }} onClick={handleClickAddButton}>
        Add
      </button>
      <button
        style={isShow && showAddForm ? { bottom: 90, right: 14 } : { bottom: 90, right: -180 }}
        onClick={handleClickAddButton}
      >
        Save
      </button>
      <button
        style={isShow && showAddForm ? { right: 12 } : { right: -140 }}
        onClick={handleClearAddForm}
      >
        Cancel
      </button>
    </div>
  );
};
