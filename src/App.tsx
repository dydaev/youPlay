import * as React from 'react';
import MainContext from './context'

import Header from './components/Header';
import Roll from './components/PlayRoll';
import Footer from './components/Footer';
import Tabs from './components/Tabs';
import PlayListContainer from './containers/PlayList';
import Player from './components/Player';

import {bodyType} from './types/bodyType'
import {playItemType} from './types/playItemType'

// import { BODYTYPE } from './models/bodyType';

import './main.scss';

const Main = () => {
	const [bodyFill, setBodyFill] = React.useState<bodyType>('player');
	const [currentTrackNumber, setCurrentTrackNumber] = React.useState<number>(0);
	const [isPlaying, setPlaying] = React.useState<boolean>(false);
	const [playList, setPlayList] = React.useState<playItemType[]>([]);

	const handleSetBody = (newFill: bodyType): void => {
		console.log(newFill)
	}

	const handlePlay = (): void => {
	    setPlaying(!isPlaying)
	}
	const handleStop = (): void => {
	    setPlaying(false)
	}
	const handlePrev = (): void => {

	    setCurrentTrackNumber(Array.isArray(playList) && playList.length
	    ? (currentTrackNumber > 0 ? currentTrackNumber - 1 : playList.length - 1)
	    : 0)
	}
	const handleNext = (): void => {
	    setCurrentTrackNumber(Array.isArray(playList) && playList.length && currentTrackNumber < playList.length-1
	    ? currentTrackNumber + 1
	    : 0)
	}
	const currentSong: playItemType | undefined =
	    Array.isArray(playList) && playList.length
	    ? playList[currentTrackNumber]
	    : undefined;

	return (
		<MainContext.Provider value={{ isPlaying: isPlaying, currentTrackNumber: currentTrackNumber }}>
			<Header onClickButton={setBodyFill} bodyType={bodyFill}/>
			{bodyFill === 'list'
			? <PlayListContainer
			    urlOfList="kkj"
			    onPlay={handlePlay}
			    onSetPlayList={setPlayList}
			    onSetCurrentTrack={setCurrentTrackNumber}
			    />
			: bodyFill === 'settings'
			    ? <p>Settings</p>
			    : <img src={currentSong ? currentSong.image : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCzlqv9WfntXDekHwsLkf5NXI9isMvdwoVLgrQveqgexa10bWp'} alt='song image'/>}
			<Footer
                isPlaying={isPlaying}
                onPlay={handlePlay}
                onStop={handleStop}
                onPrev={handlePrev}
                onNext={handleNext}
            />
		</MainContext.Provider>
	);
};
// 			<Roll />
export default Main;
