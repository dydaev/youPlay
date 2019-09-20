import * as React from 'react';

import PlayList from '../components/PlayList/index';
import PlayListManager from '../components/PlayListManager/index';

import { playItemType } from '../types/playItemType';
import { youtubeContentType } from '../types/youtubeContentType';

type propsType = {
	urlOfList: string,
	onPlay(trackNumber: number):void,
	onSetCurrentTrack(trackNumber: number):void,
	onSetPlayList(playlist: playItemType[]):void
}
type stateType = {
	playListUrl: string,
	managerIsVisible: false
}

class PlayListContainer extends React.Component <propsType>
{
	state: stateType = {
		playListUrl: this.props.urlOfList,
		managerIsVisible: false
		// playList: []
	}

	// shouldComponentUpdate(nextProps: propsType) {
	// 	console.log(nextProps, this.props)
	// 	// return JSON.stringify(nextProps) !== JSON.stringify(this.props)
	// 	return nextProps.urlOfList !== this.props.urlOfList
	// }
	// componentDidMount(){
	//
	// }

	// setPlayList = (newPlaylist: playItemType[]): void => {
	// 		if(JSON.stringify(newPlaylist) !== JSON.stringify(this.state.playList)) {
	// 				this.setState({
	// 					playList: newPlaylist
	// 				})
	//         this.props.onSetPlayList(newPlaylist);
	//     }
	// }
	componentWillReceiveProps(newProps: propsType) {
		if (newProps.urlOfList !== this.props.urlOfList) {
			this.setState({
				playListUrl: newProps.urlOfList
			})
		}
	}
	componentDidUpdate(_: any, prewState: stateType) {

		if (prewState.playListUrl !== this.state.playListUrl) {
			console.log('up-up',prewState.playListUrl, this.state.playListUrl)
			this.handleUpdatePlaylist();
		}
	}
	componentDidMount() {
		this.handleUpdatePlaylist();
	}

	handleGetYouList = async (playListUrl: string): Promise<any> => {
	  if (!('fetch' in window)) {
	    console.log('Fetch API not found, try including the polyfill');
	    return;
	  }
	  const proxyurl = "https://cors-anywhere.herokuapp.com/";

    let playObj = await fetch(proxyurl + playListUrl)
      .then(response => response.text())
      .then(contents => {
				const startString: string = '"playlist":{"playlist":{', endString: string = 'currentIndex';
				const startPlayList: number = contents.indexOf(startString) + 11;
				const endPlayList: number = contents.indexOf(endString) - 2;

				const stringOfPlaylist: string = contents.slice(startPlayList, endPlayList) + '}}'

				let playObj: youtubeContentType;
				eval(`playObj = ${stringOfPlaylist}`);

				return playObj;
			})
    	.catch(() => console.log("Cant access response. Blocked by browser?"))

			if (playObj && playObj.playlist && Array.isArray(playObj.playlist.contents)) {
console.log(playObj)
				const playLists: any = playObj.playlist.contents.map(contentItem => {
					const imagesArray = contentItem.playlistPanelVideoRenderer.thumbnail.thumbnails
					const imageUrl = imagesArray && Array.isArray(imagesArray) && imagesArray.length
						? imagesArray[imagesArray.length -1].url
						: '';
					const parsedImage: string = Array.isArray(imageUrl.match(/^http.+\.jpg\?/))
						&& imageUrl.match(/^http.+\.jpg\?/).length
						? imageUrl.match(/^http.+\.jpg\?/)[0]
						: '';

					const contextUrl = contentItem.playlistPanelVideoRenderer.navigationEndpoint.commandMetadata.webCommandMetadata.url;
					const url = Array.isArray(contextUrl.match(/^\/watch\?v=.+&list=/)) && contextUrl.match(/^\/watch\?v=.+&list=/).length
						? contextUrl.match(/^\/watch\?v=.+&list=/)[0]
						: '';

					return {
						image: parsedImage.slice(0, parsedImage.length - 1 ),
						url: 'https://youtube.com' + url.slice(0, url.length - 6) || '',
						title: contentItem.playlistPanelVideoRenderer.title.runs[0].text || '',
						album: '',
						artist: '',
						length: contentItem.playlistPanelVideoRenderer.lengthText.simpleText || ''
					}
				})

				return playLists;
			}
			return null
	}

	handleUpdatePlaylist = async () => {
		const newList: any  = await this.handleGetYouList(this.props.urlOfList);
		if(newList) {
			console.log('updateList->',newList)
			this.props.onSetPlayList(newList);
		}
	}

	handleShowManager = () => {
		this.setState({
			managerIsVisible: !this.state.managerIsVisible
		})
	}

	render(){
		const { onPlay, onSetCurrentTrack } = this.props;
		const { managerIsVisible } = this.state;

		const styles = {
			flexGrow: 1,
	    display: 'flex',
	    flexDirection: 'column',
	    justifyContent: 'space-between'
		}

		return (
			<div style={styles}>
				<PlayList
						onPlay={onPlay}
						onSetCurrentTrack={onSetCurrentTrack}
				/>
				<button type="button" onClick={this.handleShowManager}>manager</button>
				{
					managerIsVisible
					&& <PlayListManager />
				}
		</div>
		);
	}
}

export default PlayListContainer;
