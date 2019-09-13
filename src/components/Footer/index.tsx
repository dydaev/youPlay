import * as React from 'react';

// @ts-ignore: Unreachable code error
import ReactPlayer from 'react-player';

import {playItemType} from '../../types/playItemType'
import {progressType } from '../../types/progressType'
import {playStrategicType} from '../../types/playStrategicType'

import './style.scss';

type propsType = {
    isPlaying: boolean,
    currentTrack: playItemType,
    playStrategic: playStrategicType,
    setPlaying(arg: boolean): void,
    setDuration(newDuration: number): void,
    setProgress(newProgress: progressType): void,
    onPlay(trackNumber: number): void,
    onStop(): void,
    onPrev(): void,
    onNext(): void
};

const Footer = ({
    playStrategic,
    currentTrack,
    setDuration,
    setProgress,
    setPlaying,
    isPlaying,
    onPlay,
    onStop,
    onPrev,
    onNext
}: propsType) => {


	const handlePlay = () => {
	    onPlay(undefined)
	};
	const handleStop = () => {
	    onStop()
	};
	const handlePrev = () => {
	    onPrev()
	};
	const handleNext = () => {
	    onNext()
	};

	const handleDuration = (newDuration: number) : void => {
	    setDuration(newDuration);
	}
	const handleProgress = (newProgress: progressType) : void => {
	    setProgress(newProgress);
// 	    if (newProgress.played === 1) onNext();
	}

	return (
		<footer id="main-footer">
		    <ReactPlayer
                url={currentTrack ? currentTrack.url : ''}
                onPlay={() => setPlaying(true)}
                onEnded={() => playStrategic !== 'once' && onNext()}
                onPause={() => setPlaying(false)}
                onProgress={handleProgress}
                onDuration={handleDuration}
                playing={isPlaying}
                width={0}
                height={0}
			/>
			<button style={{ fontSize: 30 }} onClick={handlePrev}>
				<i className="fas fa-angle-double-left"></i>
			</button>
			<button onClick={handlePlay}>
				<i className={isPlaying ? 'fas fa-pause' : 'fas fa-play'}></i>
			</button>
			<button onClick={handleStop}>
				<i className="fas fa-stop"></i>
			</button>
			<button style={{ fontSize: 30 }} onClick={handleNext}>
				<i className="fas fa-angle-double-right"></i>
			</button>
		</footer>
	);
};

export default Footer;
