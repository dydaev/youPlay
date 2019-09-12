import * as React from 'react';
// @ts-ignore: Unreachable code error
import ReactPlayer from 'react-player';

import MainContext from './context';

import Header from './components/Header';
import Roll from './components/PlayRoll';
import Footer from './components/Footer';
import Tabs from './components/Tabs';
import PlayListContainer from './containers/PlayList';
import Player from './components/Player';

import {bodyType} from './types/bodyType'
import {progressType } from './types/progressType'
import {playItemType} from './types/playItemType'
import {playStrategicType} from './types/playStrategicType'

import {progressModel} from './models/progressModel';

import './main.scss';

function randomInteger(min: number, max: number): number {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

const Main = () => {
	const [bodyFill, setBodyFill] = React.useState<bodyType>('player');
	const [currentTrackNumber, setCurrentTrackNumber] = React.useState<number>(0);
	const [isPlaying, setPlaying] = React.useState<boolean>(false);
	const [playUrl, setPlayUrl] = React.useState<string>('');
	const [playList, setPlayList] = React.useState<playItemType[]>([]);
	const [duration, setDuration] = React.useState<number>(0);
	const [progress, setProgress] = React.useState<progressType>(progressModel);
	const [playStrategic, setPlayStrategic] = React.useState<playStrategicType>('normal');

	const handleSetBody = (newFill: bodyType): void => {
		console.log(newFill)
	}

	const handlePlay = (trackNumber: number | undefined): void => {
	    if(Array.isArray(playList) && playList.length && trackNumber !== undefined) {
	        setPlayUrl(playList[trackNumber]['url']);
	        setCurrentTrackNumber(trackNumber);

	        if(trackNumber !== currentTrackNumber) {
	            setProgress(progressModel);
	            setPlaying(true);
	        } else {
	            setPlaying(!isPlaying);
	        }
	    } else if (Array.isArray(playList) && playList.length && trackNumber === undefined) {
	        setPlaying(!isPlaying);
	   } else {
	        setPlaying(false);
	    }
	}
	const handleStop = (): void => {
	    setPlaying(false)
	}
	const handlePrev = (): void => {
    const prevTrackNumber: number = Array.isArray(playList) && playList.length
	    ? (currentTrackNumber > 0 ? currentTrackNumber - 1 : playList.length - 1)
	    : 0;

	    handlePlay(prevTrackNumber);
// 	    setCurrentTrackNumber()
	}
	const handleNext = (): void => {
	    const nextTrackNumber: number = Array.isArray(playList) && playList.length && currentTrackNumber < playList.length-1
	    ? currentTrackNumber + 1
	    : 0;

	    handlePlay(nextTrackNumber);
// 	    setCurrentTrackNumber()
	}
	const currentSong: playItemType | undefined =
	    Array.isArray(playList) && playList.length
	    ? playList[currentTrackNumber]
	    : undefined;

// 	const handleDuration = (newDuration: number) : void => {
// 	console.log(newDuration)
// 	    setDuration(newDuration);
// 	}
// 	const handleProgress = (newProgress: progressType) : void => {
// 	console.log(newProgress)
// 	    setProgress(newProgress);
// 	}

	return (
		<MainContext.Provider value={{ duration: duration, progress: progress,isPlaying: isPlaying, currentTrackNumber: currentTrackNumber }}>
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
                playStrategic={playStrategic}
                currentTrack={Array.isArray(playList) && playList.length ? playList[currentTrackNumber] : null}
                setPlaying={setPlaying}
                setDuration={setDuration}
                setProgress={setProgress}
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
