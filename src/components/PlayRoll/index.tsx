import * as React from 'react';

import './style.scss';

// export type propsType = {
// 	title: string;
// };

const Roll = () => {
	const [isPlaying, setPlaying] = React.useState(false);

	const handlePlay = () => {
		setPlaying(!isPlaying)
	}

	return (
		<div id="play-roll">

		</div>
	);
};

export default Roll;
