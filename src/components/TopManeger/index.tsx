import * as React from 'react';

import { IndexedDB, useIndexedDB, initDB } from 'react-indexed-db';

import MainContext from '../../context';

import { mainContextType } from '../../types/mainContextType';
import { playItemType } from '../../types/playItemType';

import './style.scss';

interface AppProps {
  isVisible: boolean;
  onSetPlaylist(newPlaylist: playItemType[]): void;
  onSetCurrentTrackNumber(newTrackNumber: number): void;
}

const App: React.FunctionComponent<AppProps> = ({
  isVisible,
  onSetPlaylist,
  onSetCurrentTrackNumber,
}: AppProps) => {
  const mainContext: mainContextType = React.useContext<mainContextType>(MainContext);

  const { getAll } = useIndexedDB('playLists');

  React.useEffect(() => {
    getAll()
      .then((listOfPlaylist: any): void => {
        console.log(listOfPlaylist);
      })
      .catch((err: any): void => {
        console.log('Cannt read list of playlists from storage', err);
      });
  });
  return (
    <div className="top-list_container" style={{ height: isVisible ? '100%' : 0 }}>
      {true && (
        <table className="top-list">
          <tbody>
            {mainContext.playList.map(
              (playItem: playItemType, index: number): React.ReactNode => (
                <tr
                  key={'playlistItem-' + index}
                  onClick={(): void => onSetCurrentTrackNumber(index)}
                  className={
                    index === mainContext.currentTrackNumber
                      ? 'top-list_row select-row'
                      : 'top-list_row'
                  }
                >
                  <td>
                    <span>{index + 1}</span>
                  </td>
                  <td>
                    <img src={playItem.image} alt="track Image" />
                  </td>
                  <td>
                    <p>{playItem.title}</p>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;
