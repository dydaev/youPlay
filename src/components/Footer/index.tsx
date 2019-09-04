import * as React from 'react';

import './style.scss';

const Footer = () => {
	const [isPlaying, setPlaying] = React.useState(false);

	const handlePlay = () => {
		setPlaying(!isPlaying);
	};

	return (
		<footer id="main-footer">
			<button style={{ fontSize: 30 }}>
				<i className="fas fa-angle-double-left"></i>
			</button>
			<button onClick={handlePlay}>
				<i className={isPlaying ? 'fas fa-pause' : 'fas fa-play'}></i>
			</button>
			<button onClick={()=>setPlaying(false)}>
				<i className="fas fa-stop"></i>
			</button>
			<button style={{ fontSize: 30 }}>
				<i className="fas fa-angle-double-right"></i>
			</button>
		</footer>
	);
};

export default Footer;
