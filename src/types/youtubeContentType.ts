type thumbnail = {
	width: number,
	height: number,
	url: string
};

type content = {
	playlistPanelVideoRenderer:{
		indexText: {simpleText: string},
		lengthText: {
			accessibility: {label: string}, // "2 часа 2 минуты"
			simpleText: string // "2:02:39"
		},
		longBylineText: {runs: []},
		navigationEndpoint: {
			clickTrackingParams: string,
			commandMetadata: {
				webCommandMetadata: {
					url: string, // "/watch?v=P6KwHkpN-W0&list=PLvdDCgNk3ugIwuujayLHNEOXuTtQeXphU&index=1"
					webPageType: string // "WEB_PAGE_TYPE_WATCH"
				}
			},
			watchEndpoint: {
				index: number, //0
				params: string, // "OAE%3D"
				playlistId: string, // "PLvdDCgNk3ugIwuujayLHNEOXuTtQeXphU"
				videoId: string // "P6KwHkpN-W0"
			}
		},
		selected: boolean,
		shortBylineText: {
			runs: {
				navigationEndpoint: {
					clickTrackingParams: string, // "CEoQyCAYACITCJDQtdui3OQCFQHonAodruIPjg==",
					commandMetadata: {},
					browseEndpoint: {}
				},
				text: string // "KingEric - Músicas Eletrônicas"
		}[]},
		thumbnail: {
			thumbnails: thumbnail[]
		},
		thumbnailOverlays: [],
		title: {
			simpleText: string, // "TOP HITS 2019 🌴"
			runs: [
			{
				text: string
			}
		]
		}
		trackingParams: string, // "CEoQyCAYACITCJDQtdui3OQCFQHonAodruIPjg=="
		videoId: string, //"P6KwHkpN-W0"
	}
};

type youtubeContentType = {
	playlist: {
		contents: content[],
		title: string
	};
}

export {
	thumbnail,
	content,
	youtubeContentType
}
