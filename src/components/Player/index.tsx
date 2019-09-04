import * as React from 'react';

import './style.scss';

export type propsType = {
	title: string;
};

const Playes = ({ title }: propsType) => {
	const [isPlaying, setPlaying] = React.useState(false);

	const handlePlay = () => {
		setPlaying(!isPlaying)
	}

	return (
		<div className="base-component_player">
			<h2>{title}</h2>
			<div className="base-component_player__album-image">
				<img
					src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Record-Album-02.jpg/220px-Record-Album-02.jpg"
					alt="album image"
				/>
			</div>
			<div className="base-component_player__buttons-block">
				<button style={{fontSize: 30}}>
					<i className="fas fa-angle-double-left"></i>
				</button>
				<button onClick={handlePlay}>
					<i className={isPlaying ? 'fas fa-pause' : 'fas fa-play'}></i>
				</button>
				<button>
					<i className="fas fa-stop"></i>
				</button>
				<button style={{fontSize: 30}}>
					<i className="fas fa-angle-double-right"></i>
				</button>
			</div>
		</div>
	);
};

export default Playes;
