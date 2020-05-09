interface ITubeTrackType {
  url: string;
  image: string;
  title: string;
  album: string;
  artist: string;
  length: string;
  idOfUpdatingInterval?: number;
}

interface IPlayItemTypeV2 {
  pathToFile?: string;
  readiness: number;
  song?: string;
  artist?: string;
  album?: string;
  id: string;
  image?: string;
  title: string;
  type?: string;
  description?: string;
  length?: number;
  audioBitrate?: number;
  audioChannels?: number;
  audioSampleRate?: number;
  contentLength?: number;
  createDate?: Date;
  lastUsedDate?: Date;
  idOfUpdatingInterval?: NodeJS.Timeout | void;
}

export { ITubeTrackType, IPlayItemTypeV2 };
