import {progressType} from './progressType';
import {settingsType} from './settingsType';
import {playItemType} from './playItemType';

type mainContextType = {
    duration: number,
    progress: progressType,
    isPlaying: boolean,
    currentTrackNumber: number,
    settings: settingsType,
    playList: playItemType[],
}

export {
    mainContextType
}
