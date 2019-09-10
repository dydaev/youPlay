import * as React from 'react';

import './style.scss';

type propsType = {
    isPlaying: boolean,
    onPlay(): void,
    onStop(): void,
    onPrev(): void,
    onNext(): void
};

const Footer = ({isPlaying, onPlay, onStop, onPrev, onNext}: propsType) => {


	const handlePlay = () => {
	    onPlay()
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

	return (
		<footer id="main-footer">
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
