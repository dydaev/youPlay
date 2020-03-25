import * as React from 'react';

import './ManagerItem.scss';

export interface ManagerItemProps {
  index: number;
  name: string;
  description?: string;
  swipeLeft?: number;
  swipeRight?: number;
  isSwipeTouch?: boolean;
  setCloseTools?: boolean;
  onEdit(index: number): void;
  onRemove(index: number): void;
  onOpendTools(isOpen: boolean): void;
}

const ManagerItem: React.FunctionComponent<ManagerItemProps> = ({
  name,
  swipeLeft,
  swipeRight,
  isSwipeTouch,
  description,
  index,
  onEdit,
  onRemove,
  onOpendTools,
  setCloseTools = false,
}: ManagerItemProps) => {
  const [isOpenTools, setIsOpenTools] = React.useState(false);
  const [isRemoveCofirmation, setIsRemoveCofirmation] = React.useState(false);
  const [currentWidth, setCurrentWidth] = React.useState(0);

  const widthOfOpenTools = 135;
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

  return (
    <div className="top-list_manager-item">
      <div
        className="top-list_manager-item_info"
        style={{
          ...(currentWidth > 0 ? { boxShadow: '2px 1px 5px 1px #22222288' } : {}),
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
          <button onClick={(): void => onEdit(index)}>
            <i className="fas fa-edit"></i>
          </button>
          <button onClick={(): void => setIsRemoveCofirmation(true)}>
            <i className="far fa-trash-alt"></i>
          </button>
        </div>

        <div
          className="top-list_manager-item_tools_remove-confirmation"
          style={{ right: isRemoveCofirmation ? 0 : widthOfOpenTools * -1 }}
        >
          <button onClick={(): void => onRemove(index)}>
            <i className="fas fa-check-circle"></i>
          </button>
          <button onClick={(): void => setIsRemoveCofirmation(false)}>
            <i className="fas fa-times-circle"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerItem;
