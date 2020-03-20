import { playStrategicType } from './playStrategicType';

type settingsType = {
  directYoutubeLoad: boolean;
  fullScreenMode: boolean;
  playInTray: boolean;
  timeoutOfReadingFile: number;
  downloadServer: string;
  thirdPartyServerForPlaylist: boolean;
  showVideo: boolean;
  playStrategic: playStrategicType;
  volume: number;
};

export { settingsType };
