import * as React from 'react';
import { listOfPlaylistItemType } from '../../types/listOfPlaylistItemType';

interface EditFormProps {
  index: number;
  formItems: listOfPlaylistItemType;
  onChangeForm(e: any): void;
  //   playlists: listOfPlaylistItemType[];
}

const EditForm: React.FunctionComponent<EditFormProps> = ({
  onChangeForm,
  formItems,
  index,
}: EditFormProps) => {
  return (
    <tr className="top-list_row top-list_row-add">
      <td>{index}</td>
      <td>
        <input
          id="url"
          type="text"
          placeholder="URL"
          onChange={onChangeForm}
          value={formItems.url}
        />
        <input
          id="name"
          type="text"
          placeholder="Name"
          onChange={onChangeForm}
          value={formItems.name}
        />
        <input
          id="description"
          type="text"
          placeholder="Description"
          onChange={onChangeForm}
          value={formItems.description || ''}
        />
      </td>
    </tr>
  );
};

export default EditForm;
