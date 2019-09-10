import * as React from 'react';
import MainContext from '../../context'

import { playItemType } from '../../types/playItemType';

import './style.scss';

type propsType = {
	playList: playItemType[],
	onPlay():void,
	onSetCurrentTrack(trackNumber: number):void
};

const PlayList = ({ playList, onPlay, onSetCurrentTrack}: propsType) => {
// 	const [isPlaying, setPlaying] = React.useState<playItemType[]>([]);

    const mainContext: {isPlaying: boolean, currentTrackNumber: number} = React.useContext(MainContext);

    const handlePlay = (track: number) => {
        onSetCurrentTrack(track)
        if(!mainContext.isPlaying) onPlay()
    }

	return (
			<ul className="main-component_play-list">
				{Array.isArray(playList) &&
					playList.map((playItem: playItemType, index: number): any => (
						<li key={'listOfTracks' + index.toString()} onClick={()=>handlePlay(index)}>
						    <div className={mainContext.currentTrackNumber === index ? 'track-time-line' : ''}/>
							<img
								src={ playItem.image || "http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image"}
								alt="placeholder+image"
							/>
							<p><span style={{ color: 'darksalmon'}}>{playItem.artist}</span><span>{playItem.title}</span></p>
							<span>{playItem.length}</span>
						</li>
					))}
			</ul>
	);
};

export default PlayList;
