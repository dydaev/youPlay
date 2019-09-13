import {progressType} from './progressType';
import {settingsType} from './settingsType';

type mainContextType = {
    duration: number,
    progress: progressType,
    isPlaying: boolean,
    currentTrackNumber: number,
    settings: settingsType
}

export {
    mainContextType
}