import * as React from 'react';
import MainContext from '../../context';

import db from '../../db';

import { listOfPlaylistItemType } from '../../types/listOfPlaylistItemType';

import { mainContextType } from '../../types/mainContextType';

import './style.scss';

const clearModel:listOfPlaylistItemType = {
	name: '',
	url: ''
}

export type propTypes = {
	onSetCurrentPlaylistNumber(number: number): void,
  onSetList(playList: listOfPlaylistItemType[]): void
}

const PlayListManager = ({onSetList, onSetCurrentPlaylistNumber}: propTypes) => {
	// const [listOfPlaylist, props.onSetList] = React.useState<listOfPlaylistItemType[]>([]);
	const [selectedItem, setSelectedItem] = React.useState<listOfPlaylistItemType>(clearModel);
	const [indexForListEditor, setIndexForListEditor] = React.useState<number | undefined | null>(undefined);

	const mainContext: mainContextType = React.useContext<mainContextType>(MainContext);

	const handleAddItem = (newItem: listOfPlaylistItemType) =>
		onSetList([...mainContext.listOfPlaylist, newItem]);

	const handleChangeItem = ({target} : {target: { id: string, value: string}}) =>
		setSelectedItem({...selectedItem, [target.id]: target.value});

	const handleRemoveItem = (removingIndex: number) => {
		const removingItem = mainContext.listOfPlaylist.find((_: any, index: number) => index === removingIndex)
		db.removePlaylist(removingItem);
		onSetList([...mainContext.listOfPlaylist.filter((_: any, index: number) => index !== removingIndex)]);
	}

	const handleUpdateItem = (newItem: listOfPlaylistItemType, indexOfItem: number) =>
		onSetList([...mainContext.listOfPlaylist.map((item: listOfPlaylistItemType, index: number) => (index === indexOfItem
			? newItem
			: item))]);

	const handleSavePlaylistToStorage = (playlist: listOfPlaylistItemType): void => {
		db.setPlaylist(playlist);
	};

	const handleSave = () => {
		if (indexForListEditor === null) {
			handleSavePlaylistToStorage(selectedItem);
			handleAddItem(selectedItem);

		} else if (indexForListEditor) {
			handleUpdateItem(selectedItem, indexForListEditor);
		}
		// closing form for input
		setIndexForListEditor(indexForListEditor === undefined ? null : undefined);
		setSelectedItem(clearModel);
	}

	const handleAddPlaylist = () => {
		setIndexForListEditor(indexForListEditor === undefined ? null : undefined);
	}

	const handleSelectPlaylist = (index: number) => {
		onSetCurrentPlaylistNumber(index)
	}

	const handleSelectItem = (index: number) => console.log(mainContext.listOfPlaylist[index]);// onSelectItem(listOfPlaylist[index]);

	return (
		<div id="component-listOfPlaylistItemType">
			<ul>
			{
				mainContext.listOfPlaylist.map((playlistItem: listOfPlaylistItemType, index: number) => (
					<li key={'playItemListIndex' + index.toString()}>
						<button onClick={() => handleSelectPlaylist(index)}>
							{
								mainContext.currentPlaylistNumber !== index
								? <i className="fas fa-play" />
								: <i className="fas fa-stop" />
							}
						</button>
						<a onClick={() => handleSelectItem(index)}>
							<span>{playlistItem.name}</span>
							<span>{playlistItem.url}</span>
						</a>
						<button className="component-listOfPlaylistItemType__remove-button" type="button" onClick={()=>handleRemoveItem(index)}>-</button>
					</li>
				))
			}

			</ul>
			<button
				type="button"
				onClick={handleAddPlaylist}
				style={{
					background: indexForListEditor === undefined ? 'green' : 'yellow'
				}}
			>
				{
					indexForListEditor === undefined
					? 'Add'
					: 'cancel'
				}
			</button>
			{
				indexForListEditor !== undefined
				&& <div className="component-listOfPlaylistItemType-editor">
					<div>
						<input type="text" id="name" placeholder="Name" onChange={handleChangeItem} />
						<input type="text" id="url" placeholder="Url" onChange={handleChangeItem} />
					</div>
					<button type="button" onClick={handleSave}>Save</button>
				</div>
			}
		</div>
	);
};

export default PlayListManager;
