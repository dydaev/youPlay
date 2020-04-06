import * as React from 'react';
import { listOfPlaylistItemType } from '../../types/listOfPlaylistItemType';

interface EditFormProps {
  index: number;
  isShowForm: boolean;
  prefixForId?: string;
  formItems: listOfPlaylistItemType;
  onChangeForm(e: any, prefixForId: string): void;
  //   playlists: listOfPlaylistItemType[];
}

const EditForm: React.FunctionComponent<EditFormProps> = ({
  onChangeForm,
  formItems,
  isShowForm,
  prefixForId = '',
  index,
}: EditFormProps) => {
  const UrlInput = React.useRef(null);

  const handleClickUrlButton = async (): Promise<void> => {
    if (formItems.url) {
      onChangeForm({ target: { id: 'url', value: '' } }, prefixForId);
    } else {
      navigator.clipboard.readText().then((pastingText: string): void => {
        onChangeForm({ target: { id: 'url', value: pastingText } }, prefixForId);
      });
    }
  };

  return (
    <div
      className="top-list_manager-item_form"
      style={isShowForm ? { width: '100%', height: 125 } : {}}
    >
      <input
        id={prefixForId + '_' + 'name'}
        type="text"
        placeholder="Name"
        onChange={(e: any): void => onChangeForm(e, prefixForId)}
        value={formItems.name}
      />
      <input
        id={prefixForId + '_' + 'description'}
        type="text"
        placeholder="Description"
        onChange={(e: any): void => onChangeForm(e, prefixForId)}
        value={formItems.description}
      />
      <div>
        <input
          ref={UrlInput}
          id={prefixForId + '_' + 'url'}
          type="text"
          placeholder="URL"
          spellCheck={false}
          onChange={(e: any): void => onChangeForm(e, prefixForId)}
          value={formItems.url}
        />
        <button onClick={handleClickUrlButton}>{formItems.url ? 'Clear' : 'Paste'}</button>
      </div>
    </div>
  );
};

export default EditForm;
