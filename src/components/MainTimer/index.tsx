import * as React from "react";

import { progressType } from "../../types/progressType";
import { listOfPlaylistItemType } from "../../types/";

import "./style.scss";

const clearModel: listOfPlaylistItemType = {
	name: "",
	url: "",
};

export type propTypes = {
	onShow: boolean;
	duration: number;
	progress: progressType;
};

const PlayListManager = ({ onShow, duration, progress }: propTypes) => {
	return (
		<div id="main-timer">
			{onShow && (
				<span>
					{duration && progress && progress.playedSeconds
						? lib.seconds2time(Math.floor(duration - progress.playedSeconds))
						: this.state.duration
						? lib.seconds2time(Math.floor(duration))
						: ""}
				</span>
			)}
		</div>
	);
};

export default PlayListManager;
