import * as React from 'react';
import MainContext from '../../context';
import { useIndexedDB } from 'react-indexed-db';

import { listOfPlaylistItemType } from '../../types/listOfPlaylistItemType';

import { IMainContextType } from '../../types/mainContextType';

import './style.scss';

const clearModel: listOfPlaylistItemType = {
  name: '',
  url: '',
  description: '',
};

export type propTypes = {
  onUpdatePlaylist(url: string | undefined): void;
  onSetCurrentPlaylistNumber(number: number): void;
  onSetList(playList: listOfPlaylistItemType[]): void;
};

const PlayListManager = ({
  onSetList,
  onUpdatePlaylist,
  onSetCurrentPlaylistNumber,
}: propTypes): JSX.Element => {
  const { add, update, getAll, deleteRecord } = useIndexedDB('playLists');
  const [selectedItem, setSelectedItem] = React.useState<listOfPlaylistItemType>(clearModel);
  const [indexForListEditor, setIndexForListEditor] = React.useState<number | undefined | null>(
    undefined,
  );

  const mainContext: IMainContextType = React.useContext<IMainContextType>(MainContext);

  const getPlaylistsFromStorage = async (): Promise<void> => {
    getAll().then(
      PlayListsFromDb => {
        onSetList(PlayListsFromDb);
      },
      error => {
        console.log('Cannt get playlists from storage.', error);
      },
    );
  };

  React.useEffect(() => {
    getPlaylistsFromStorage();
  }, []);

  const handleAddPlaylistToStorage = (playlist: listOfPlaylistItemType): void => {
    add(playlist).then(
      idOfPlaylist => {
        console.log('ID Generated: ', idOfPlaylist);
      },
      error => {
        console.log('Failed of saving paylist.', error);
      },
    );
  };

  const handleAddItem = (newItem: listOfPlaylistItemType): void => {
    handleAddPlaylistToStorage(newItem);
    getPlaylistsFromStorage();

    onSetList([...mainContext.listOfPlaylist, newItem]);
  };

  const handleChangeItem = ({ target }: { target: { id: string; value: string } }): void =>
    setSelectedItem({ ...selectedItem, [target.id]: target.value });

  const handleRemoveItem = (removingIndex: number): void => {
    if (removingIndex >= 0) {
      const removingItem = mainContext.listOfPlaylist.find(
        (_: any, index: number) => index === removingIndex,
      );

      if (removingItem.id) {
        deleteRecord(removingItem.id);
      }

      onSetList([
        ...mainContext.listOfPlaylist.filter((_: any, index: number) => index !== removingIndex),
      ]);
    }
  };

  const handleUpdateItem = async (
    newItem: listOfPlaylistItemType,
    indexOfItem: number,
  ): Promise<void> => {
    if (newItem.id) {
      update(newItem)
        .then(() => {
          getPlaylistsFromStorage();
        })
        .catch(err => console.log('Cannot update playlist.', err));
    } else {
      onSetList([
        ...mainContext.listOfPlaylist.map((item: listOfPlaylistItemType, index: number) =>
          index === indexOfItem ? newItem : item,
        ),
      ]);
    }
  };

  const handleSave = (): void => {
    console.log(indexForListEditor);

    if (indexForListEditor === null) {
      handleAddItem(selectedItem);
    } else {
      handleUpdateItem(selectedItem, indexForListEditor);
    }

    // closing form for input
    setSelectedItem(clearModel);
    setIndexForListEditor(indexForListEditor === undefined ? null : undefined);
  };

  const handleAddPlaylist = (): void => {
    setSelectedItem(clearModel);
    setIndexForListEditor(indexForListEditor === undefined ? null : undefined);
  };

  const handleSelectPlaylist = (index: number): void => {
    onSetCurrentPlaylistNumber(index);
    if (Array.isArray(mainContext.listOfPlaylist) && index < mainContext.listOfPlaylist.length)
      onUpdatePlaylist(mainContext.listOfPlaylist[index].url);
  };

  const handleSelectItem = (index: number): void => {
    console.log(`Selected ${index} playlist`);
    //console.log(mainContext.listOfPlaylist[index]); // onSelectItem(listOfPlaylist[index]);
  };

  const handleEditItem = (index: number): void => {
    if (Array.isArray(mainContext.listOfPlaylist) && mainContext.listOfPlaylist.length) {
      const selectedItem = mainContext.listOfPlaylist[index];
      handleAddPlaylist();
      setIndexForListEditor(index);
      setSelectedItem(selectedItem);
    }
  };

  return (
    <div id="component-listOfPlaylistItemType">
      <ul>
        {mainContext.listOfPlaylist.map((playlistItem: listOfPlaylistItemType, index: number) => (
          <li
            key={'playItemListIndex' + index.toString()}
            style={mainContext.currentPlaylistNumber === index ? { background: 'gainsboro' } : {}}
          >
            <button onClick={(): void => handleSelectPlaylist(index)}>
              <i className="fas fa-play" />
            </button>
            <a onClick={(): void => handleSelectItem(index)}>
              <span style={{ textAlign: 'center' }}>{playlistItem.name}</span>
              <span>{playlistItem.description}</span>
            </a>
            <button
              className="component-listOfPlaylistItemType__edit-button"
              type="button"
              onClick={(): void => handleEditItem(index)}
            >
              <i className="far fa-edit"></i>
            </button>{' '}
            <button
              className="component-listOfPlaylistItemType__remove-button"
              type="button"
              onClick={(): void => handleRemoveItem(index)}
            >
              <i className="far fa-trash-alt"></i>
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={handleAddPlaylist}
        style={{
          background: indexForListEditor === undefined ? 'lightgreen' : '#ffef95',
        }}
      >
        {indexForListEditor === undefined ? 'Add' : 'cancel'}
      </button>
      {indexForListEditor !== undefined && (
        <div className="component-listOfPlaylistItemType-editor">
          <div>
            <input
              type="text"
              id="url"
              placeholder="Url"
              onChange={handleChangeItem}
              value={selectedItem.url}
            />
            <input
              type="text"
              id="name"
              placeholder="Name"
              onChange={handleChangeItem}
              value={selectedItem.name}
            />
            <input
              type="text"
              id="description"
              placeholder="Description"
              onChange={handleChangeItem}
              value={selectedItem.description}
            />
          </div>
          <button type="button" onClick={(): void => handleSave()}>
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default PlayListManager;
