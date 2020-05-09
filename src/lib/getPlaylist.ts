import Strategy from './strategy';

import { messageType } from '../types/messageType';
import { IPlayItemTypeV2, ITubeTrackType } from '../types/playItemType';

export type getPlaylistType = (
  url: string,
  downloadServer: string,
  showMessage: (message: messageType) => void,
) => Promise<ITubeTrackType[]>;

export const getPlaylistFromServer: getPlaylistType = async (url, downloadServer, showMessage) => {
  if (url.includes('list')) {
    const stringOfStartListId = 'list=';
    const stringOfEndListId = '&';

    const startOfListId = url.indexOf(stringOfStartListId) + stringOfStartListId.length;
    const endOfListId = url.indexOf(stringOfEndListId, startOfListId);

    const listId =
      endOfListId >= 0 ? url.slice(startOfListId, endOfListId) : url.slice(startOfListId);

    const content: ITubeTrackType[] = await fetch(`${downloadServer}/getPlayList/${listId}`)
      .then(async response => response.text())
      .then(playlistFromServer => JSON.parse(playlistFromServer))
      .catch((ee: any): void => {
        console.log(ee);

        showMessage({
          text: 'It seems the server is busy. Try the server later(',
          type: 'WARNING',
        });
      });

    return content;
  }
};

export const getPlaylistFromCurlServer: getPlaylistType = async (
  url,
  downloadServers,
  showMessage,
) => {
  if (!('fetch' in window)) {
    console.log('Fetch API not found, try including the polyfill');
    return;
  }

  const content: string | void = await fetch(downloadServers + url)
    .then(response => response.text())
    .catch(ee => {
      showMessage({
        text: 'It seems the server is busy. Try the server later(',
        type: 'WARNING',
      });
      console.log('Cant access response. Blocked by browser?', ee);
    });

  if (content && content.length) {
    switch (true) {
      case /^\D*youtube.{5}watch\?.+$/.test(url):
        try {
          const parsedContent: ITubeTrackType[] = Strategy.playlistWith(content);
          if (parsedContent) return parsedContent;
          throw new Error('Can`t get playlist!');
        } catch (e) {
          console.log(e);
          return null;
        }
        break;

      case /^\D*youtube.{5}playlist\?.+$/.test(url):
        try {
          const parsedContent: ITubeTrackType[] = Strategy.playlist(content);
          if (parsedContent) return parsedContent;

          throw new Error('Can`t get playlist!');
        } catch (e) {
          console.log(e);
          return null;
        }
        break;

      default:
        showMessage({
          text: "Сan't recognize playlist",
          type: 'WARNING',
        });
        return null;
    }
  }
};

export const handleGetPlaylistFromServer = async (
  playlistUrl: string,
  serverAddress: string,
  useThirdServer: boolean,
  showMessage: (message: messageType) => void,
): Promise<ITubeTrackType[]> =>
  useThirdServer
    ? await getPlaylistFromCurlServer(
        playlistUrl,
        'https://cors-anywhere.herokuapp.com/',
        showMessage,
      )
    : await getPlaylistFromServer(playlistUrl, serverAddress, showMessage);
