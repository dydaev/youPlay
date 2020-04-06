import * as React from 'react';

import './ManagerItem.scss';
import { listOfPlaylistItemType } from '../../types/listOfPlaylistItemType';
import EditForm from './EditForm';

export interface ManagerItemProps {
  index: number;
  url: string;
  name: string;
  swipeLeft?: number;
  isShowForm: boolean;
  swipeRight?: number;
  description?: string;
  isSwipeTouch?: boolean;
  setCloseTools?: boolean;
  formItems: listOfPlaylistItemType;
  onChangeForm(e: any): void;
  onToggleForm(index: number): void;
  onRemove(index: number): void;
  onOpendTools(isOpen: boolean): void;
}

const ManagerItem: React.FunctionComponent<ManagerItemProps> = ({
  url,
  name,
  swipeLeft,
  swipeRight,
  isSwipeTouch,
  description,
  index,
  formItems,
  onChangeForm,
  onRemove,
  isShowForm,
  onToggleForm,
  onOpendTools,
  setCloseTools = false,
}: ManagerItemProps) => {
  // const [isShowForm, setIsShowForm] = React.useState(false);
  const [isOpenTools, setIsOpenTools] = React.useState(false);
  const [isRemoveCofirmation, setIsRemoveCofirmation] = React.useState(false);
  const [currentWidth, setCurrentWidth] = React.useState(0);

  const widthOfOpenTools = 215;
  const minWidthForOpen = 30;

  const handleShowTools = (isShow: boolean): void => {
    if (isShow) {
      setCurrentWidth(widthOfOpenTools);
      setIsOpenTools(true);
      onOpendTools(true);
    } else {
      setCurrentWidth(0);
      setIsOpenTools(false);
      setIsRemoveCofirmation(false);
      onOpendTools(false);
    }
  };

  ((): void => {
    if (!isOpenTools && swipeLeft !== currentWidth) {
      // check open tools && block re-render
      if (!isSwipeTouch) {
        if (currentWidth > minWidthForOpen) {
          handleShowTools(true);
        } else {
          setCurrentWidth(0);
        }
      } else {
        if (swipeLeft > 0 && swipeLeft < widthOfOpenTools) setCurrentWidth(swipeLeft);
      }
    }
    if (isOpenTools && currentWidth !== widthOfOpenTools - swipeRight) {
      if (!isSwipeTouch) {
        if (currentWidth < widthOfOpenTools - minWidthForOpen) {
          handleShowTools(false);
        } else {
          setCurrentWidth(widthOfOpenTools);
        }
      } else {
        if (swipeRight > 0 && swipeRight < widthOfOpenTools)
          setCurrentWidth(widthOfOpenTools - swipeRight);
      }
    }
    if (setCloseTools && isOpenTools) handleShowTools(false);
  })();

  const handleToggleForm = (e: any): void => {
    e.stopPropagation();
    onToggleForm(index);
    handleShowTools(isShowForm);
  };

  const handleClickUrlButton = async (): Promise<void> => {
    if (formItems.url) {
      onChangeForm({ target: { id: 'url', value: '' } });
    } else {
      // UrlInput.current.select();
      // document.execCommand('clipboardRead');
      navigator.clipboard.readText().then((pastingText: string): void => {
        onChangeForm({ target: { id: 'url', value: pastingText } });
      });
    }
  };

  return (
    <div className="top-list_manager-item">
      <EditForm
        prefixForId={index + 'I'}
        onChangeForm={onChangeForm}
        formItems={formItems}
        isShowForm={isShowForm}
        index={index}
      />
      <div
        className="top-list_manager-item_info"
        style={{
          ...(currentWidth > 0 ? { boxShadow: '2px 1px 5px 1px #22222288' } : {}),
          ...(isShowForm ? { width: 0, padding: 0 } : {}),
        }}
      >
        <p style={isOpenTools ? { paddingLeft: 2 } : {}}>{name}</p>
        <p style={isOpenTools ? { paddingLeft: 2 } : {}}>{description || ''}</p>
      </div>
      <div
        style={{
          width: currentWidth,
        }}
        className="top-list_manager-item_tools"
      >
        <div>
          <button onClick={handleToggleForm /* onEdit(index) */}>
            <i className="fas fa-edit"></i>
          </button>
          <button
            onClick={(e: any): void => {
              e.stopPropagation();
              setIsRemoveCofirmation(true);
            }}
          >
            <i className="far fa-trash-alt"></i>
          </button>
        </div>

        <div
          className="top-list_manager-item_tools_remove-confirmation"
          style={{ right: isRemoveCofirmation ? 0 : widthOfOpenTools * -1 }}
        >
          <button
            onClick={(e: any): void => {
              e.stopPropagation();
              onRemove(index);
            }}
          >
            <i className="fas fa-check-circle"></i>
          </button>
          <button
            onClick={(e: any): void => {
              e.stopPropagation();
              setIsRemoveCofirmation(false);
            }}
          >
            <i className="fas fa-times-circle"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerItem;
