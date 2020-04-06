import * as React from 'react';

import MainContext from '../../context';
import { mainContextType } from '../../types/mainContextType';
import { playItemType } from '../../types/playItemType';

// import './ManagerItem.scss';

export interface ManagerItemProps {
  playItem: playItemType;
  swipeLeft?: number;
  swipeRight?: number;
  isSwipeTouch?: boolean;
  setCloseTools?: boolean;
}

const ManagerItem: React.FunctionComponent<ManagerItemProps> = ({
  playItem,
  swipeLeft,
  swipeRight,
  isSwipeTouch,
  setCloseTools = false,
}: ManagerItemProps) => {
  // const [isShowForm, setIsShowForm] = React.useState(false);
  const mainContext: mainContextType = React.useContext<mainContextType>(MainContext);
  const [isOpenTools, setIsOpenTools] = React.useState(false);
  const [currentWidth, setCurrentWidth] = React.useState(0);

  const widthOfOpenTools = 100;
  const minWidthForOpen = 30;

  const handleShowTools = (isShow: boolean): void => {
    if (isShow) {
      setCurrentWidth(widthOfOpenTools);
      setIsOpenTools(true);
    } else {
      setCurrentWidth(0);
      setIsOpenTools(false);
    }
  };

  const download = (url: string, trackName: string, e: any): void => {
    e.stopPropagation();
    const fileId = url.replace(/^.*v=/, '');
    const downloadingUrl = `${mainContext.settings.downloadServer}/downloading/${fileId}`;
    fetch(downloadingUrl, { method: 'POST' })
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${trackName}.webm`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        handleShowTools(false);
      })
      .catch(e => console.log('Cannt downloading track.', e));
  };

  const handleDownload = (): void => {};

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
        <p style={isOpenTools ? { paddingLeft: 2 } : {}}>{playItem.title}</p>
      </div>
      <div
        style={{
          width: currentWidth,
        }}
        className="top-list_manager-item_tools"
      >
        <div>
          <button onClick={handleDownload}>
            <img
              style={{
                position: 'absolute',
                height: 50,
                width: 50,
                top: '50%',
                right: 0,
                padding: 3,
                transform: 'translate(-15%, -50%)',
                opacity: 0.7,
              }}
              onClick={(e): void => download(playItem.url, playItem.title, e)}
              src={
                process.env.NODE_ENV == 'development'
                  ? '../../img/download.png'
                  : 'img/download.png'
              }
            />
          </button>
          <button style={{ display: 'none' }} />
        </div>
      </div>
    </div>
  );
};

export default ManagerItem;
