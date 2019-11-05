import { progressType } from "./progressType";
import { settingsType } from "./settingsType";
import { playItemType } from "./playItemType";
import { messageType } from "./messageType";
import { listOfPlaylistItemType } from "./listOfPlaylistItemType";

type mainContextType = {
	duration: number;
	progress: progressType;
	isPlaying: boolean;
	currentTrackNumber: number;
	settings: settingsType;
	playList: playItemType[];
	currentPlaylistNumber: number;
	listOfPlaylist: listOfPlaylistItemType[];
	showMessage(message: messageType | void): void;
};

export { mainContextType };
