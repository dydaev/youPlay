import * as React from 'react';
import { listOfPlaylistItemType } from '../../types/listOfPlaylistItemType';

import './style.scss';
import Swiper from '../Swiper';
import ManagerItem from './ManagerItem';
import EditForm from './EditForm';

import { IMainContextType } from '../../types/mainContextType';
import MainContext from '../../context';

const clearForm: listOfPlaylistItemType = {
  name: '',
  description: '',
  url: '',
};

export interface ManagerProps {
  isShow: boolean;
  isShowTopList: boolean;
  onAddPlaylist(newPlaylist: listOfPlaylistItemType): void;
  onUpdatePlaylist(newPlaylist: listOfPlaylistItemType): void;
  onUpdateListOfPlaylists(updatedList: listOfPlaylistItemType[]): void;
  onChangeCurrentPlaylistNumber(selectedPlaylistIndex: number): void;
}

export const notShowStyle = {
  margin: 0,
  padding: 0,
  width: 0,
  display: 'block',
};

export const Manager: React.FunctionComponent<ManagerProps> = ({
  isShow,
  isShowTopList,
  onAddPlaylist,
  onUpdatePlaylist,
  onUpdateListOfPlaylists,
  onChangeCurrentPlaylistNumber,
}: ManagerProps) => {
  const mainContext: IMainContextType = React.useContext<IMainContextType>(MainContext);
  const [formItems, setFormItems] = React.useState<listOfPlaylistItemType>(clearForm);
  const [indexOfEditForm, setIndexOfEditForm] = React.useState(NaN);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [showForm, setShowForm] = React.useState(NaN);

  const handleToggleForm = (index: number): void => {
    if (showForm === index) setShowForm(NaN);
    else {
      setFormItems(mainContext.listOfPlaylist[index]);
      setShowAddForm(false);
      setShowForm(index);
    }
  };

  const handleClickAddButton = (): void => {
    setShowForm(NaN);
    setShowAddForm(!showAddForm);
  };
  const handleChangeForm = (e: any, idPrefix?: string): void => {
    const keyOfItem: string = e.target.id.replace(new RegExp(`\^${idPrefix}_`), '');

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
    setShowForm(NaN);
  };
  const handleClearAddForm = (): void => {
    setFormItems(clearForm);
    setShowAddForm(false);
    setShowForm(NaN);
  };

  const handleRemove = (index: number): void =>
    onUpdateListOfPlaylists(
      mainContext.listOfPlaylist.filter((_: any, idx: number): boolean => index !== idx),
    );

  const calbackOfOpenItemTools = (isOpen: boolean): void => {
    if (!isOpen) setIndexOfEditForm(NaN);
  };

  return (
    <div style={isShow ? {} : notShowStyle}>
      <table className="top-list">
        <tbody>
          {mainContext.listOfPlaylist.map(
            (playlist: listOfPlaylistItemType, index: number): React.ReactNode => (
              <tr
                key={'playlistItem-' + index}
                onClick={(): void => onChangeCurrentPlaylistNumber(index)}
                className={
                  index === mainContext.currentPlaylistNumber
                    ? 'top-list_row select-row'
                    : 'top-list_row'
                }
              >
                <td style={{ width: 55 }}>
                  <span>{index + 1}</span>
                </td>
                <td>
                  <Swiper>
                    <ManagerItem
                      index={index}
                      onSelect={onChangeCurrentPlaylistNumber}
                      formItems={formItems}
                      onChangeForm={handleChangeForm}
                      isShowForm={showForm === index}
                      onToggleForm={handleToggleForm}
                      url={playlist.url}
                      name={playlist.name}
                      description={playlist.description}
                      onRemove={handleRemove}
                      onOpendTools={calbackOfOpenItemTools}
                      setCloseTools={!isShow || !isShowTopList}
                    />
                  </Swiper>
                </td>
              </tr>
            ),
          )}
          <tr className="top-list_row">
            <td colSpan={2} style={{ textAlign: 'center' }}>
              <div
                className="top-list_manager-item"
                style={showAddForm && Number.isNaN(indexOfEditForm) ? {} : { height: 0 }}
              >
                <EditForm
                  prefixForId="add"
                  isShowForm={showAddForm}
                  formItems={formItems}
                  onChangeForm={handleChangeForm}
                  index={
                    mainContext.listOfPlaylist.length ? mainContext.listOfPlaylist.length + 1 : 1
                  }
                />
              </div>

              <button
                className={
                  mainContext.listOfPlaylist && !mainContext.listOfPlaylist.length
                    ? 'button_add blob green'
                    : 'button_add'
                }
                style={showAddForm && Number.isNaN(indexOfEditForm) ? { display: 'none' } : {}}
                onClick={handleClickAddButton}
              >
                <i className="fas fa-plus"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <button
        style={
          isShow && (!Number.isNaN(showForm) || showAddForm)
            ? { bottom: 90, right: 14 }
            : { bottom: 90, right: -180 }
        }
        onClick={handleSaveForm}
      >
        Save
      </button>
      <button
        style={isShow && (!Number.isNaN(showForm) || showAddForm) ? { right: 12 } : { right: -140 }}
        onClick={handleClearAddForm}
      >
        Cancel
      </button>
    </div>
  );
};
