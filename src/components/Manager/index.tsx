import * as React from 'react';
import { listOfPlaylistItemType } from '../../types/listOfPlaylistItemType';

import './style.scss';

const clearForm: listOfPlaylistItemType = {
  name: '',
  description: '',
  url: '',
};

export interface ManagerProps {
  isShow: boolean;
  selectedPlaylist: number;
  playlists: listOfPlaylistItemType[];
  onAddPlaylist(newPlaylist: listOfPlaylistItemType): void;
  onUpdatePlaylist(newPlaylist: listOfPlaylistItemType): void;
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
  selectedPlaylist,
  onAddPlaylist,
  onUpdatePlaylist,
  onSetCurrentPlaylistNumber,
}: ManagerProps) => {
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [formItems, setFormItems] = React.useState<listOfPlaylistItemType>(clearForm);

  const handleClickAddButton = (): void => {
    if (!showAddForm) {
      setShowAddForm(!showAddForm);
    } else {
      console.log('save form');
      setShowAddForm(!showAddForm);
    }
  };
  const handleUpdateForm = (e: any): void => {
    const keyOfItem: string = e.target.id;
    setFormItems({
      ...formItems,
      [keyOfItem]: e.target.value,
    });
  };
  const handleSaveForm = (): void => {
    if (formItems) onAddPlaylist(formItems);
    else onUpdatePlaylist(formItems);

    setShowAddForm(false);
  };
  const handleClearAddForm = (): void => {
    setFormItems(clearForm);
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
                onDoubleClick={(): void => onSetCurrentPlaylistNumber(index)}
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
                <input id="url" type="text" placeholder="URL" onChange={handleUpdateForm} />
                <input id="name" type="text" placeholder="Name" onChange={handleUpdateForm} />
                <input
                  id="description"
                  type="text"
                  placeholder="Description"
                  onChange={handleUpdateForm}
                />
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
        onClick={handleSaveForm}
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
