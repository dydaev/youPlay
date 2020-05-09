import { IPlayItemTypeV2, ITubeTrackType } from '../types/playItemType';
import { youtubeOfListContentType } from '../types/youtubeOfListContentType';

export default {
  playlist: (content: string): ITubeTrackType[] => {
    // tslint:disable-next-line:one-variable-per-declaration
    const startString = '{"playlistVideoListRenderer":{"contents":',
      endString = 'style":"DEFAULT"}}]}}],"playlistId"';

    const startPlayList: number = content.indexOf(startString) + 41;
    const endPlayList: number = content.indexOf(endString) + 22;

    const stringOfPlaylist: string = content.slice(startPlayList, endPlayList);

    const playObj: youtubeOfListContentType[] = [];
    if (stringOfPlaylist && stringOfPlaylist.length) {
      // tslint:disable-next-line:no-eval
      eval(`playObj = ${stringOfPlaylist}`);

      if (Array.isArray(playObj) && playObj.length) {
        return playObj.map(
          ({ playlistVideoRenderer }: youtubeOfListContentType): ITubeTrackType => {
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

            // const trackID = url.replace(/&.*/, '').replace(/^.*v=/, '');

            return {
              album: '',
              artist: '',
              image: parsedImage,
              length: trackTime.text,
              title: playlistVideoRenderer.title.runs[0].text || '',
              url: 'https://youtube.com' + url.slice(0, url.length - 6) || '',
            };
          },
        );
      }
    }

    return null;
  },
  playlistWith: (content: string): ITubeTrackType[] => {
    // tslint:disable-next-line:one-variable-per-declaration
    const startString = '"playlist":{"playlist":{',
      endString = 'currentIndex';

    const startPlayList: number = content.indexOf(startString) + 11;
    const endPlayList: number = content.indexOf(endString) - 2;

    const stringOfPlaylist: string = content.slice(startPlayList, endPlayList) + '}}';

    const playObj: any = {};
    if (stringOfPlaylist && stringOfPlaylist.length) {
      // tslint:disable-next-line:no-eval
      eval(`playObj = ${stringOfPlaylist}`);

      const playLists: ITubeTrackType[] = playObj.playlist.contents.map((contentItem: any) => {
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

        const trackID = url.replace(/&.*/, '').replace(/^.*v=/, '');

        return {
          album: '',
          artist: '',
          image: parsedImage,
          length: contentItem.playlistPanelVideoRenderer.lengthText.simpleText || '',
          title: Array.isArray(contentItem.playlistPanelVideoRenderer.title.runs)
            ? contentItem.playlistPanelVideoRenderer.title.runs[0].text
            : contentItem.playlistPanelVideoRenderer.title.simpleText || '',
          url: 'https://youtube.com' + url.slice(0, url.length - 6) || '',
        };
      });
      return playLists;
    }
    return null;
  },
};
