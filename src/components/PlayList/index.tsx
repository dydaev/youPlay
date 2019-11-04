import * as React from "react";
import MainContext from "../../context";

import ProgressLine from "../ProgressLine";

import { bodyType } from "../../types/bodyType";
import { playItemType } from "../../types/playItemType";
import { mainContextType } from "../../types/mainContextType";

import "./style.scss";

type propsType = {
	onPlay(trackNumber: number): void;
	onSetCurrentTrack(trackNumber: number): void;
	onClose(type: bodyType): void;
};

const PlayList = ({ onPlay, onSetCurrentTrack, onClose }: propsType) => {
	const mainContext: mainContextType = React.useContext<mainContextType>(MainContext);

	const handlePlay = (track: number) => {
		onPlay(track);
	};

	return (
		<>
			<div className="settings-playlist_header">
				<p>Play list</p>
				<div />
				<button onClick={() => onClose("player")}>{">"}</button>
			</div>
			<ul className="main-component_play-list">
				{Array.isArray(mainContext.playList) &&
					mainContext.playList.map((playItem: playItemType, index: number): any => (
						<li key={"listOfTracks" + index.toString()} onClick={() => handlePlay(index)}>
							<img
								style={{ width: 85 }}
								src={
									playItem.image ||
									"http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image"
								}
								alt="placeholder+image"
							/>
							{index !== mainContext.currentTrackNumber ? (
								<div>
									<p>
										<span style={{ color: "darksalmon" }}>{playItem.artist}</span>
										<span>{playItem.title}</span>
									</p>
									<span>{playItem.length}</span>
								</div>
							) : (
								<div>
									<ProgressLine
										color="gray"
										filling={mainContext.progress.played * 100}
										invert={true}
									/>
									<ProgressLine
										color="gray"
										height={2}
										filling={mainContext.progress.loaded * 100}
									/>

									<p>
										<span style={{ color: "darksalmon" }}>{playItem.artist}</span>
										<span>{playItem.title}</span>
									</p>
									<span>{playItem.length}</span>
								</div>
							)}
						</li>
					))}
			</ul>
		</>
	);
};

export default PlayList;
