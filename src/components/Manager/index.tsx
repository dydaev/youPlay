import * as React from 'react';
import { listOfPlaylistItemType } from '../../types/listOfPlaylistItemType';

import './style.scss';
import Swiper from '../Swiper';
import ManagerItem from './ManagerItem';
import EditForm from './EditForm';

const clearForm: listOfPlaylistItemType = {
  name: '',
  description: '',
  url: '',
};

export interface ManagerProps {
  isShow: boolean;
  isShowTopList: boolean;
  selectedPlaylist: number;
  playlists: listOfPlaylistItemType[];
  onAddPlaylist(newPlaylist: listOfPlaylistItemType): void;
  onUpdatePlaylist(newPlaylist: listOfPlaylistItemType): void;
  onUpdateListOfPlaylists(updatedList: listOfPlaylistItemType[]): void;
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
  isShowTopList,
  selectedPlaylist,
  onAddPlaylist,
  onUpdatePlaylist,
  onUpdateListOfPlaylists,
  onSetCurrentPlaylistNumber,
}: ManagerProps) => {
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [formItems, setFormItems] = React.useState<listOfPlaylistItemType>(clearForm);
  const [indexOfEditForm, setIndexOfEditForm] = React.useState(NaN);

  const handleClickAddButton = (): void => {
    if (!showAddForm) {
      setShowAddForm(!showAddForm);
    } else {
      console.log('save form');
      setShowAddForm(!showAddForm);
    }
  };
  const handleChangeForm = (e: any): void => {
    const keyOfItem: string = e.target.id;

    setFormItems({
      ...formItems,
      [keyOfItem]: e.target.value,
    });
  };
  const handleSaveForm = (): void => {
    if (!formItems.id) onAddPlaylist(formItems);
    else onUpdatePlaylist(formItems);

    setFormItems(clearForm);
    setShowAddForm(false);
  };
  const handleClearAddForm = (): void => {
    setFormItems(clearForm);
    setIndexOfEditForm(NaN);
    setShowAddForm(false);
  };

  const handleEdit = (index: number): void => {
    setShowAddForm(true);
    setFormItems(playlists[index]);
    setIndexOfEditForm(index);
  };
  const handleRemove = (index: number): void =>
    onUpdateListOfPlaylists(playlists.filter((_: any, idx: number): boolean => index !== idx));

  const calbackOfOpenItemTools = (isOpen: boolean): void => {
    if (!isOpen) setIndexOfEditForm(NaN);
  };

  return (
    <div style={isShow ? {} : notShowStyle}>
      <table className="top-list">
        <tbody>
          {playlists.map(
            (playlist: listOfPlaylistItemType, index: number): React.ReactNode =>
              showAddForm && indexOfEditForm === index ? (
                <EditForm
                  key={'playlistItem-' + index}
                  onChangeForm={handleChangeForm}
                  index={index + 1}
                  formItems={formItems}
                />
              ) : (
                <tr
                  key={'playlistItem-' + index}
                  onClick={(): void => onSetCurrentPlaylistNumber(index)}
                  className={
                    index === selectedPlaylist ? 'top-list_row select-row' : 'top-list_row'
                  }
                >
                  <td style={{ width: 55 }}>
                    <span>{index + 1}</span>
                  </td>
                  <td>
                    <Swiper>
                      <ManagerItem
                        name={playlist.name}
                        description={playlist.description}
                        onEdit={handleEdit}
                        onRemove={handleRemove}
                        onOpendTools={calbackOfOpenItemTools}
                        index={index}
                        setCloseTools={!isShow || !isShowTopList}
                      />
                    </Swiper>
                  </td>
                </tr>
              ),
          )}
          {showAddForm && Number.isNaN(indexOfEditForm) && (
            <EditForm
              formItems={formItems}
              onChangeForm={handleChangeForm}
              index={playlists.length ? playlists.length + 1 : 1}
            />
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
