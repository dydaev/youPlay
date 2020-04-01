import Strategy from './strategy';

import { messageType } from '../types/messageType';
import { playItemType } from '../types/playItemType';

export interface IgetPlaylist {
  (url: string, downloadServer: string, showMessage: (message: messageType) => void): Promise<
    playItemType[] | void
  >;
}

export const getPlaylistFromServer: IgetPlaylist = async (url, downloadServer, showMessage) => {
  if (url.includes('list')) {
    const stringOfStartListId = 'list=';
    const stringOfEndListId = '&';

    const startOfListId = url.indexOf(stringOfStartListId) + stringOfStartListId.length;
    const endOfListId = url.indexOf(stringOfEndListId, startOfListId);

    const listId =
      endOfListId >= 0 ? url.slice(startOfListId, endOfListId) : url.slice(startOfListId);

    const content: playItemType[] | void = await fetch(`${downloadServer}/getPlayList/${listId}`)
      .then(async response => response.text())
      .then(playlistFromServer => JSON.parse(playlistFromServer))
      .catch((ee: any): void => {
        console.log(ee);

        showMessage({
          type: 'WARNING',
          text: 'It seems the server is busy. Try the server later(',
        });
      });

    return content;
  }
};

export const getPlaylistFromCurlServer: IgetPlaylist = async (
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
        type: 'WARNING',
        text: 'It seems the server is busy. Try the server later(',
      });
      console.log('Cant access response. Blocked by browser?', ee);
    });

  if (content && content.length) {
    switch (true) {
      case /^\D*youtube.{5}watch\?.+$/.test(url):
        try {
          const parsedContent: playItemType[] = Strategy.playlistWith(content);
          if (parsedContent) return parsedContent;

          throw 'Can`t get playlist!';
        } catch (e) {
          console.log(e);
          return null;
        }
        break;

      case /^\D*youtube.{5}playlist\?.+$/.test(url):
        try {
          const parsedContent: playItemType[] = Strategy.playlist(content);
          if (parsedContent) return parsedContent;

          throw 'Can`t get playlist!';
        } catch (e) {
          console.log(e);
          return null;
        }
        break;

      default:
        showMessage({
          type: 'WARNING',
          text: "Сan't recognize playlist",
        });
        return null;
    }
  }
};
