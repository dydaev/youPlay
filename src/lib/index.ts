export default {
	useFullScreenMode: (state: boolean) => {
		try {
			if (typeof window.orientation !== 'undefined') {
				addEventListener('click', function() {
					var el = document.documentElement,
						rfs = state
							? el.requestFullscreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen
							: el.exitFullscreen;
					rfs.call(el);
				});
			}
		} catch (e) {
			console.log('Can not use full screen mode(.', e);
		}
	},
	usePlaingInTry: (isSavePlaying: any, setPlaying: any) => {
		try {
			window.addEventListener(
				'visibilitychange',
				() => {
					if (isSavePlaying) {
						console.log('playing after lost the focus');
						setPlaying(true);
					} else {
						setPlaying(false);
					}
				},
				false,
			);
		} catch (e) {
			console.log('Can not playing in tray(.', e);
		}
	},
};
