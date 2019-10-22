import {progressType} from './progressType';
import {settingsType} from './settingsType';
import {playItemType} from './playItemType';
import { listOfPlaylistItemType } from './listOfPlaylistItemType';

type mainContextType = {
    duration: number,
    progress: progressType,
    isPlaying: boolean,
    currentTrackNumber: number,
    settings: settingsType,
    playList: playItemType[],
    currentPlaylistNumber: number,
    listOfPlaylist: listOfPlaylistItemType[],
}

export {
    mainContextType
}
