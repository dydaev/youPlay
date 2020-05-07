type playItemType = {
  url: string;
  image: string;
  title: string;
  album: string;
  artist: string;
  length: string;
};

interface IPlayItemTypeV2 {
  pathToFile?: string;
  downloaded: number;
  converted?: number;
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
}

export { playItemType, IPlayItemTypeV2 };
