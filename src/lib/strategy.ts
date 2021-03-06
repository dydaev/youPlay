import { playItemType } from '../types/playItemType';
import { youtubeOfListContentType } from '../types/youtubeOfListContentType';

export default {
  playlist: (content: string): playItemType[] => {
    const startString = '{"playlistVideoListRenderer":{"contents":',
      endString = 'style":"DEFAULT"}}]}}],"playlistId"';

    const startPlayList: number = content.indexOf(startString) + 41;
    const endPlayList: number = content.indexOf(endString) + 22;

    const stringOfPlaylist: string = content.slice(startPlayList, endPlayList);

    const playObj: youtubeOfListContentType[] = [];
    if (stringOfPlaylist && stringOfPlaylist.length) {
      eval(`playObj = ${stringOfPlaylist}`);

      if (Array.isArray(playObj) && playObj.length) {
        return playObj.map(
          ({ playlistVideoRenderer }: youtubeOfListContentType): playItemType => {
            // image
            const imagesArray = playlistVideoRenderer.thumbnail.thumbnails;
            const imageUrl =
              imagesArray && Array.isArray(imagesArray) && imagesArray.length
                ? imagesArray[imagesArray.length - 1].url
                : '';
            const parsedImage: string =
              Array.isArray(imageUrl.match(/^http.+\.jpg[\?]*/)) &&
              imageUrl.match(/^http.+\.jpg[\?]*/).length
                ? imageUrl.match(/^http.+\.jpg{1}/)[0]
                : '';
            // url
            const contextUrl =
              playlistVideoRenderer.navigationEndpoint.commandMetadata.webCommandMetadata.url;
            const url =
              Array.isArray(contextUrl.match(/^\/watch\?v=.+&list=/)) &&
              contextUrl.match(/^\/watch\?v=.+&list=/).length
                ? contextUrl.match(/^\/watch\?v=.+&list=/)[0]
                : '';

            const trackTime =
              playlistVideoRenderer.lengthText &&
              Array.isArray(playlistVideoRenderer.lengthText.runs)
                ? playlistVideoRenderer.lengthText.runs[0]
                : { text: '' };

            return {
              image: parsedImage,
              url: 'https://youtube.com' + url.slice(0, url.length - 6) || '',
              title: playlistVideoRenderer.title.runs[0].text || '',
              album: '',
              artist: '',
              length: trackTime.text,
            };
          },
        );
      }
    }

    return null;
  },
  playlistWith: (content: string): playItemType[] => {
    const startString = '"playlist":{"playlist":{',
      endString = 'currentIndex';

    const startPlayList: number = content.indexOf(startString) + 11;
    const endPlayList: number = content.indexOf(endString) - 2;

    const stringOfPlaylist: string = content.slice(startPlayList, endPlayList) + '}}';

    const playObj: any = {};
    if (stringOfPlaylist && stringOfPlaylist.length) {
      eval(`playObj = ${stringOfPlaylist}`);

      const playLists: playItemType[] = playObj.playlist.contents.map((contentItem: any) => {
        // image
        const imagesArray = contentItem.playlistPanelVideoRenderer.thumbnail.thumbnails;
        const imageUrl =
          imagesArray && Array.isArray(imagesArray) && imagesArray.length
            ? imagesArray[imagesArray.length - 1].url
            : '';
        const parsedImage: string =
          Array.isArray(imageUrl.match(/^http.+\.jpg[\?]*/)) &&
          imageUrl.match(/^http.+\.jpg[\?]*/).length
            ? imageUrl.match(/^http.+\.jpg{1}/)[0]
            : '';
        // url
        const contextUrl =
          contentItem.playlistPanelVideoRenderer.navigationEndpoint.commandMetadata
            .webCommandMetadata.url;
        const url =
          Array.isArray(contextUrl.match(/^\/watch\?v=.+&list=/)) &&
          contextUrl.match(/^\/watch\?v=.+&list=/).length
            ? contextUrl.match(/^\/watch\?v=.+&list=/)[0]
            : '';

        return {
          image: parsedImage,
          url: 'https://youtube.com' + url.slice(0, url.length - 6) || '',
          title: Array.isArray(contentItem.playlistPanelVideoRenderer.title.runs)
            ? contentItem.playlistPanelVideoRenderer.title.runs[0].text
            : contentItem.playlistPanelVideoRenderer.title.simpleText || '',
          album: '',
          artist: '',
          length: contentItem.playlistPanelVideoRenderer.lengthText.simpleText || '',
        };
      });
      return playLists;
    }
    return null;
  },
};
