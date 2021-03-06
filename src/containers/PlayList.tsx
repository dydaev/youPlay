import * as React from 'react';

import { useIndexedDB } from 'react-indexed-db';

import PlayList from '../components/PlayListo/index';
import PlayListManager from '../components/PlayListManager/index';

import { bodyType } from '../types/bodyType';
import { playItemType } from '../types/playItemType';
import { listOfPlaylistItemType } from '../types/listOfPlaylistItemType';
import { mainContextType } from '../types/mainContextType';

import Strategy from '../lib/strategy';
import lib from '../lib/index';

import mainContext from '../context';

type propsType = {
  context?: mainContextType;
  onShow: boolean;
  urlOfList: string;
  onClose(type: bodyType): void;
  onGetPleyListFromStorage(): void;
  onPlay(trackNumber: number): void;
  onSetCurrentTrack(trackNumber: number): void;
  onSetPlayList(playlist: playItemType[]): void;
  onSetCurrentPlaylistNumber(number: number): void;
  onSetList(playList: listOfPlaylistItemType[]): void;
};
type stateType = {
  isLoading: boolean;
  playListUrl: string;
  managerIsVisible: boolean;
  playListFromStor: playItemType[];
};

class PlayListContainer extends React.Component<propsType, stateType, mainContextType> {
  static contextType: any = mainContext;

  state: stateType = {
    isLoading: false,
    playListUrl: this.props.urlOfList,
    managerIsVisible: false,
    playListFromStor: [],
  };

  shouldComponentUpdate(
    nextProps: propsType,
    nextState: stateType,
    nextContext: mainContextType,
  ): boolean {
    const { equal } = lib;

    return (
      !equal(nextState.playListFromStor, this.state.playListFromStor) ||
      !equal(nextContext.playList, this.context.playList) ||
      JSON.stringify(nextState.playListFromStor) !== JSON.stringify(this.state.playListFromStor) ||
      this.props.urlOfList !== nextProps.urlOfList ||
      this.state.managerIsVisible !== nextState.managerIsVisible ||
      this.state.isLoading !== nextState.isLoading
    );
  }

  UNSAFE_componentWillReceiveProps(newProps: propsType): void {
    if (newProps.urlOfList !== this.props.urlOfList) {
      this.setState({
        playListUrl: newProps.urlOfList,
      });
    }
  }

  componentDidMount(): void {
    this.handleGetPlaylistFromStroage();
  }

  handleGetPlaylistFromStroage = (): void => {
    const { getAll } = useIndexedDB('currentPlayList');
    getAll().then(
      (playlist: playItemType[]): void => {
        if (Array.isArray(playlist) && playlist.length) this.props.onSetPlayList(playlist);
      },
      err => console.log('Cannt get current playlist from storage', err),
    );
  };

  handleAddPlaylistToStroage = (newList: playItemType[]): void => {
    if (Array.isArray(newList) && newList.length) {
      const { add } = useIndexedDB('currentPlayList');

      newList.forEach((playlistItem: playItemType): void => {
        add(playlistItem).catch((err: any): void =>
          console.log('Cannt add current playlist to storage', err),
        );
      });
    }
  };

  handleClearStroage = (): void => {
    // @ts-ignore:
    const { clear } = useIndexedDB('currentPlayList');
    clear().catch((err: any): void => console.log('Cannt clear storage of playlists', err));
  };

  handleGetYouList = async (playListUrl: string): Promise<any> => {
    if (!('fetch' in window)) {
      console.log('Fetch API not found, try including the polyfill');
      return;
    }
    const proxyurl = 'https://cors-anywhere.herokuapp.com/';

    const content: string | void = await fetch(proxyurl + playListUrl)
      .then(response => response.text())
      // .then(contents => content)
      .catch(ee => {
        if (typeof this.context !== 'undefined' && this.context.showMessage) {
          this.context.showMessage({
            type: 'WARNING',
            text: 'It seems the server is busy. Try the server later(',
          });
        } else {
          console.log('Cant access response. Blocked by browser?', ee);
        }
      });

    if (content && content.length) {
      switch (true) {
        case /^\D*youtube.{5}watch\?.+$/.test(playListUrl):
          try {
            const parsedContent: any = await Strategy.playlistWith(content);
            if (parsedContent) return parsedContent;

            throw 'Can`t get playlist!';
          } catch (e) {
            this.context.showMessage({
              type: 'WARNING',
              text: e,
            });
            return null;
          }
          break;

        case /^\D*youtube.{5}playlist\?.+$/.test(playListUrl):
          try {
            const parsedContent: any = await Strategy.playlist(content);
            if (parsedContent) return parsedContent;

            throw 'Can`t get playlist!';
          } catch (e) {
            this.context.showMessage({
              type: 'WARNING',
              text: e,
            });
            return null;
          }
          break;

        default:
          this.context.showMessage({
            type: 'WARNING',
            text: "Сan't recognize playlist",
          });
          return null;
        // break;
      }
      return null;
    }

    this.context.showMessage({
      type: 'WARNING',
      text: 'Can`t get content from server',
    });
    return null;
  };

  handleSetLoading = (is: boolean): void => {
    this.setState({
      isLoading: is,
    });
  };

  handleGetYouListFromYouServer = async (url: string): Promise<string | void> => {
    if (url.includes('list')) {
      const stringOfStartListId = 'list=';
      const stringOfEndListId = '&';

      const startOfListId = url.indexOf(stringOfStartListId) + stringOfStartListId.length;
      const endOfListId = url.indexOf(stringOfEndListId, startOfListId);

      const listId =
        endOfListId >= 0 ? url.slice(startOfListId, endOfListId) : url.slice(startOfListId);

      const proxyurl = this.context.settings.downloadServer + '/getPlayList';

      const content: string | void = await fetch(`${proxyurl}/${listId}`)
        .then(async response => response.text())
        .then(playlistFromServer => JSON.parse(playlistFromServer))
        .catch(ee => {
          if (typeof this.context !== 'undefined' && this.context.showMessage) {
            this.context.showMessage({
              type: 'WARNING',
              text: 'It seems the server is busy. Try the server later(',
            });
          } else {
            console.log('Cant access response. Blocked by browser?', ee);
          }
        });

      return content;
    }
    // const pleylistItem: playItemType;
  };

  handleUpdatePlaylist = async (url: string = undefined): Promise<void> => {
    if (this.props.urlOfList) {
      this.handleSetLoading(true);

      const newList: any = this.context.settings.thirdPartyServerForPlaylist
        ? await this.handleGetYouList(url ? url : this.props.urlOfList)
        : await this.handleGetYouListFromYouServer(url ? url : this.props.urlOfList);

      this.handleSetLoading(false);
      // TODO: check different between newList and this.state.playListFromStor

      if (Array.isArray(newList) && newList.length) {
        console.log('Get', newList.length, 'play items');
        this.handleClearStroage();
        this.handleAddPlaylistToStroage(newList);
        this.props.onSetPlayList(newList);
      }
    }
  };

  handleShowManager = (): void => {
    this.setState({
      managerIsVisible: !this.state.managerIsVisible,
    });
  };

  handleClosePlayList = (): void => {
    if (this.state.managerIsVisible) {
      setTimeout(() => {
        this.handleShowManager();
      }, 1000);
    }
    this.props.onClose('player');
  };

  render(): React.ReactNode {
    const { managerIsVisible, isLoading } = this.state;

    const {
      onShow,
      onPlay,
      onClose,
      onSetCurrentTrack,
      onSetList,
      onSetCurrentPlaylistNumber,
    } = this.props;

    const styles = {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      overflow: 'hidden',
      right: onShow ? 0 : '-100%',
      // position: "relative",
    } as React.CSSProperties;

    return (
      <section style={styles}>
        <div className="settings-playlist_header">
          <button
            onClick={(): Promise<void> => this.handleUpdatePlaylist()}
            className={isLoading ? 'rotate' : ''}
          >
            <i className="fas fa-sync"></i>
          </button>
          <p>Play list</p>
          <div />
          <button onClick={this.handleClosePlayList}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        {managerIsVisible ? (
          <PlayListManager
            onUpdatePlaylist={this.handleUpdatePlaylist}
            onSetCurrentPlaylistNumber={onSetCurrentPlaylistNumber}
            onSetList={onSetList}
          />
        ) : (
          <PlayList onClose={onClose} onPlay={onPlay} onSetCurrentTrack={onSetCurrentTrack} />
        )}
        <button
          type="button"
          className="play-list__main-manager-button"
          onClick={this.handleShowManager}
        >
          manager
        </button>
      </section>
    );
  }
}

export default PlayListContainer;
