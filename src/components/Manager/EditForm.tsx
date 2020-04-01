import * as React from 'react';
import { listOfPlaylistItemType } from '../../types/listOfPlaylistItemType';

interface EditFormProps {
  index: number;
  isShowForm: boolean;
  formItems: listOfPlaylistItemType;
  onChangeForm(e: any): void;
  //   playlists: listOfPlaylistItemType[];
}

const EditForm: React.FunctionComponent<EditFormProps> = ({
  onChangeForm,
  formItems,
  isShowForm,
  index,
}: EditFormProps) => {
  const UrlInput = React.useRef(null);

  const handleClickUrlButton = async (): Promise<void> => {
    if (formItems.url) {
      onChangeForm({ target: { id: 'url', value: '' } });
    } else {
      navigator.clipboard.readText().then((pastingText: string): void => {
        onChangeForm({ target: { id: 'url', value: pastingText } });
      });
    }
  };

  return (
    <div
      className="top-list_manager-item_form"
      style={isShowForm ? { width: '100%', height: 125 } : {}}
    >
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
        value={formItems.description}
      />
      <div>
        <input
          ref={UrlInput}
          id="url"
          type="text"
          placeholder="URL"
          spellCheck={false}
          onChange={onChangeForm}
          value={formItems.url}
        />
        <button onClick={handleClickUrlButton}>{formItems.url ? 'Clear' : 'Paste'}</button>
      </div>
    </div>
  );
};

export default EditForm;
