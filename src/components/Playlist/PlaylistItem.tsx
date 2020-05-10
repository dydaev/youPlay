import * as React from 'react';

import * as Axios from 'axios';

import MainContext from '../../context';

import { IMainContextType } from '../../types/mainContextType';
import { IPlayItemTypeV2 } from '../../types/playItemType';

// import './ManagerItem.scss';

export interface IManagerItemProps {
  index: number;
  playItem: IPlayItemTypeV2;
  swipeLeft?: number;
  swipeRight?: number;
  isSwipeTouch?: boolean;
  isShowingPlaylist: boolean;
  setCloseTools?: boolean;
  onSelect(index: number): void;
  onUpdateTrackForce(trackForceId: string): void;
}

const ManagerItem: React.FunctionComponent<IManagerItemProps> = ({
  isShowingPlaylist,
  index,
  playItem,
  swipeLeft,
  swipeRight,
  isSwipeTouch,
  setCloseTools = false,
  onUpdateTrackForce,
  onSelect,
}: IManagerItemProps) => {
  // const [isShowForm, setIsShowForm] = React.useState(false);
  const mainContext: IMainContextType = React.useContext<IMainContextType>(MainContext);
  const [isOpenTools, setIsOpenTools] = React.useState(false);
  const [currentWidth, setCurrentWidth] = React.useState(0);

  const widthOfOpenTools = 140;
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

  const download = (id: string, trackName: string, e: any): void => {
    e.stopPropagation();

    // const fileId = url.replace(/^.*v=/, '');
    const downloadingUrl = `${mainContext.settings.downloadServer}/downloading/${id}`;
    fetch(downloadingUrl, { method: 'POST' })
      .then(response => response.blob())
      .then(blob => {
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = `${trackName}.mp3`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        handleShowTools(false);
      })
      .catch(err => console.log('Cannt downloading track.', err));
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
        if (swipeRight > 0 && swipeRight < widthOfOpenTools) {
          setCurrentWidth(widthOfOpenTools - swipeRight);
        }
      }
    }
    if (setCloseTools && isOpenTools) handleShowTools(false);
  })();

  const handleUpdateTrackForce = () => {
    handleShowTools(false);
    onUpdateTrackForce(playItem.id);
  };

  const trackIsLoading =
    typeof playItem !== 'undefined' &&
    playItem.idOfUpdatingInterval &&
    // @ts-ignore
    Array.isArray(window.intervals) &&
    // @ts-ignore
    window.intervals.includes(playItem.idOfUpdatingInterval);

  let trackTime = '';
  if (playItem && playItem.length) {
    trackTime =
      playItem.length > 3600
        ? new Date(1000 * playItem.length).toISOString().substr(11, 8)
        : new Date(1000 * playItem.length).toISOString().substr(14, 5);
  }

  return (
    <div className="top-list_manager-item">
      <div
        className="top-list_manager-item_info"
        style={{
          ...(currentWidth > 0 ? { boxShadow: '2px 1px 5px 1px #22222288' } : {}),
        }}
        onClick={(): void => onSelect(index)}
      >
        <p
          style={{
            color:
              !mainContext.settings.showVideo && playItem.readiness < 100 ? '#333333' : 'unset',
            paddingLeft: isOpenTools ? 2 : 'unset',
          }}
        >
          {playItem && playItem.title ? playItem.title + ' - ' + trackTime : ''}
        </p>
        {!mainContext.settings.showVideo && playItem.readiness !== 100 && (
          <div className="top-list_manager-item_info-spiner">
            <span>{playItem.readiness ? playItem.readiness.toFixed() : 0}%</span>
            {trackIsLoading && (
              <div className="spiner">
                <div className="dot1"></div>
                <div className="dot2"></div>
              </div>
            )}
          </div>
        )}
      </div>
      <div
        style={{
          minWidth: currentWidth,
        }}
        className="top-list_manager-item_tools"
      >
        <div>
          <button onClick={handleUpdateTrackForce}>
            <i style={{ fontSize: 45 }} className="fas fa-sync"></i>
          </button>
          <button onClick={(e): void => download(playItem.id, playItem.title, e)}>
            <i className="fas fa-download"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerItem;
