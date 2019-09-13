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
import Settings from './components/Settings';

import {bodyType} from './types/bodyType'
import {progressType } from './types/progressType'
import {playItemType} from './types/playItemType'
import {playStrategicType} from './types/playStrategicType'
import {settingsType} from './types/settingsType'

import {progressModel} from './models/progressModel';
import {settingsModel} from './models/settingsModel';

import './main.scss';

function randomInteger(min: number, max: number): number {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

const Main = () => {
	const [playUrl, setPlayUrl] = React.useState<string>('');
	const [duration, setDuration] = React.useState<number>(0);
	const [isPlaying, setPlaying] = React.useState<boolean>(false);
	const [bodyFill, setBodyFill] = React.useState<bodyType>('player');
	const [playList, setPlayList] = React.useState<playItemType[]>([]);
	const [progress, setProgress] = React.useState<progressType>(progressModel);
	const [settings, setSettings] = React.useState<settingsType>(settingsModel);
	const [currentTrackNumber, setCurrentTrackNumber] = React.useState<number>(0);
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
	}
	const handleNext = (): void => {
	    const nextTrackNumber: number = Array.isArray(playList) && playList.length && currentTrackNumber < playList.length-1
	    ? currentTrackNumber + 1
	    : 0;

	    handlePlay(nextTrackNumber);
	}
	const currentSong: playItemType | undefined =
	    Array.isArray(playList) && playList.length
	    ? playList[currentTrackNumber]
	    : undefined;

	return (
		<MainContext.Provider value={{ settings: settings,duration: duration, progress: progress,isPlaying: isPlaying, currentTrackNumber: currentTrackNumber }}>
			<Header onClickButton={setBodyFill} bodyType={bodyFill}/>
			{bodyFill === 'list'
			? <PlayListContainer
			    urlOfList="kkj"
			    onPlay={handlePlay}
			    onSetPlayList={setPlayList}
			    onSetCurrentTrack={setCurrentTrackNumber}
			    />
			: bodyFill === 'settings'
			    ? <Settings onSetSettings={setSettings}/>
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
