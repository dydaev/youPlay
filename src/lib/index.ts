export default {
	equal: (objA: any, objB: any): boolean => {
		return JSON.stringify(objA) === JSON.stringify(objB);
	},
	randomInteger: (min: number, max: number): number => {
		const rand = min + Math.random() * (max + 1 - min);
		return Math.floor(rand);
	},
	useFullScreenMode: async (isActive: boolean) => {
		try {
			if (typeof window.orientation !== "undefined" && document.fullscreenEnabled) {
				const elem: any = document.documentElement;

				var listener = function() {
					elem.requestFullscreen() ||
						elem.webkitRequestFullScreen() ||
						elem.mozRequestFullScreen() ||
						elem.msRequestFullscreen();
				};
				if (elem && isActive && !document.fullscreen) {
					document.addEventListener("click", listener, false);

					elem.requestFullscreen() ||
						elem.webkitRequestFullScreen() ||
						elem.mozRequestFullScreen() ||
						elem.msRequestFullscreen();
				}

				if (!isActive && document.fullscreen) {
					document.removeEventListener("click", listener, false);
					console.log("removeListner");
					document.exitFullscreen();
					window.location.reload();
				}
			}
		} catch (e) {
			console.log("Can not use full screen mode(.");
		}
	},
	usePlaingInTry: (isSavePlaying: any, setPlaying: any) => {
		try {
			window.addEventListener(
				"visibilitychange",
				() => {
					if (isSavePlaying) {
						console.log("playing after lost the focus");
						setPlaying(true);
					} else {
						setPlaying(false);
					}
				},
				false,
			);
		} catch (e) {
			console.log("Can not playing in tray(.", e);
		}
	},
	seconds2time: (seconds: any) => {
		const time: any = new Date(seconds * 1000).toISOString();
		if (seconds > 3600) return time.substr(11, 8);

		return time.substr(14, 5);
	},
};
