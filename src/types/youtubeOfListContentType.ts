type youtubeOfListContentType = {
	playlistVideoRenderer: {
		videoId: string;
		thumbnail: {
			thumbnails: [
				{
					url: string;
					width: number;
					height: number;
				},
			];
			webThumbnailDetailsExtensionData: {
				isPreloaded: boolean;
			};
		};
		title: {
			runs: [
				{
					text: string;
				},
			];
			accessibility: {
				accessibilityData: {
					label: string;
				};
			};
		};
		index: {
			runs: [
				{
					text: number;
				},
			];
		};
		shortBylineText: {
			runs: [
				{
					text: string;
					navigationEndpoint: {
						clickTrackingParams: string;
						commandMetadata: {
							webCommandMetadata: {
								url: string;
								rootVe: number;
							};
						};
						browseEndpoint: {
							browseId: string;
						};
					};
				},
			];
		};
		lengthText: {
			runs: [
				{
					text: string;
				},
			];
			accessibility: {
				accessibilityData: {
					label: string;
				};
			};
		};
		navigationEndpoint: {
			clickTrackingParams: string;
			commandMetadata: {
				webCommandMetadata: {
					url: string;
					rootVe: number;
				};
			};
			watchEndpoint: {
				videoId: string;
				playlistId: string;
				index: 1;
				startTimeSeconds: number;
			};
		};
		lengthSeconds: number;
		trackingParams: string;
		isPlayable: true;
		menu: {
			menuRenderer: {
				items: [
					{
						menuNavigationItemRenderer: {
							text: {
								runs: [
									{
										text: string;
									},
								];
							};
							navigationEndpoint: {
								clickTrackingParams: string;
								commandMetadata: {
									webCommandMetadata: {
										url: string;
										rootVe: number;
									};
								};
								signInEndpoint: {
									hack: boolean;
								};
							};
							trackingParams: string;
						};
					},
				];
				trackingParams: string;
				accessibility: {
					accessibilityData: {
						label: string;
					};
				};
			};
		};
		isWatched: boolean;
		thumbnailOverlays: [
			{
				thumbnailOverlayTimeStatusRenderer: {
					text: {
						runs: [
							{
								text: string;
							},
						];
						accessibility: {
							accessibilityData: {
								label: string;
							};
						};
					};
					style: string;
				};
			},
		];
	};
};

export { youtubeOfListContentType };
