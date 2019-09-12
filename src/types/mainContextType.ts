import {progressType} from './progressType';

type mainContextType = {
    duration: number,
    progress: progressType,
    isPlaying: boolean,
    currentTrackNumber: number
}

export {
    mainContextType
}