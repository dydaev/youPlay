import * as React from 'react';

import { listOfPlaylistItemType } from '../../types/listOfPlaylistItemType';

import './style.scss';

const clearModel:listOfPlaylistItemType = {
	name: '',
	url: ''
}

const PlayListManager = () => {
	const [listOfPlaylist, setList] = React.useState<listOfPlaylistItemType[]>([]);
	const [selectedItem, setSelectedItem] = React.useState<listOfPlaylistItemType>(clearModel);
	const [indexForListEditor, setIndexForListEditor] = React.useState<any>(undefined);

	const handleAddItem = (newItem: listOfPlaylistItemType) =>
		setList([...listOfPlaylist, newItem]);

	const handleChangeItem ({target} : {target: { id: string, value: string}}) =>
		setSelectedItem({...selectedItem, [id]: value})

	const handleRemoveItem = (removingIndex: number) =>
		setList([...listOfPlaylist.filter((_: any, index: number) => index !== removingIndex)]);

	const handleUpdateItem = (newItem: listOfPlaylistItemType, indexOfItem: number) =>
		setList([...listOfPlaylist.map((item: string, index: number) => (index === indexOfItem
			? newItem
			: item))]);

	const handleSave = () => {

		if (indexForListEditor === null) {
				handleAddItem(selectedItem)
		} else if (indexForListEditor) {
			handleUpdateItem(selectedItem, indexForListEditor)
		}
		setSelectedItem(clearModel)
	}

	const handleSelectItem = (item: listOfPlaylistItemType) => onSelectItem(item);

	return (
		<div id="component-listOfPlaylistItemType">
			<ul>
			{
				listOfPlaylist.map((playlistItem: listOfPlaylistItemType, index: number) => (
					<li key={'playItemListIndex' + index.toString()}>
						<a onClick={()=>}>
							<span>{playlistItem.name}</span>
							<span>{playlistItem.url}</span>
						</a>
						<button type="button" onClick={()=>handleRemoveItem(index)}>-</button>
					</li>
				))
			}
				<li>
					<button type="button" onClick={() => setVisiblePlayListEditor(null)}>
						Add playlist
					</button>
				</li>
			</ul>
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
