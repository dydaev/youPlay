import * as React from "react";

import lib from "../../lib";

import { progressType } from "../../types/progressType";

import "./style.scss";

export type propTypes = {
	onShow: boolean;
	duration: number;
	progress: progressType;
};

const PlayListManager = ({ onShow, duration, progress }: propTypes) => {
	return (
		<>
			{onShow && (
				<span id="main-timer">
					{duration && progress && progress.playedSeconds
						? lib.seconds2time(Math.floor(duration - progress.playedSeconds))
						: duration
						? lib.seconds2time(Math.floor(duration))
						: ""}
				</span>
			)}
		</>
	);
};

export default PlayListManager;
