import * as React from "react";

import PlayList from "../components/PlayList/index";
import PlayListManager from "../components/PlayListManager/index";

import { bodyType } from "../types/bodyType";
import { playItemType } from "../types/playItemType";
import { youtubeContentType } from "../types/youtubeContentType";
import { listOfPlaylistItemType } from "../types/listOfPlaylistItemType";
import { mainContextType } from "../types/mainContextType";

import Strategy from "../lib/strategy";

import mainContext from "../context";

type propsType = {
	context?: mainContextType;
	onShow: boolean;
	urlOfList: string;
	onClose(type: bodyType): void;
	onPlay(trackNumber: number): void;
	onSetCurrentTrack(trackNumber: number): void;
	onSetPlayList(playlist: playItemType[]): void;
	onSetCurrentPlaylistNumber(number: number): void;
	onSetList(playList: listOfPlaylistItemType[]): void;
};
type stateType = {
	playListUrl: string;
	managerIsVisible: false;
};

class PlayListContainer extends React.Component<propsType> {
	static contextType: any = mainContext;

	state: stateType = {
		playListUrl: this.props.urlOfList,
		managerIsVisible: false,
		// playList: []
	};

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
				playListUrl: newProps.urlOfList,
			});
		}
	}
	componentDidUpdate(_: any, prevState: stateType) {
		if (prevState.playListUrl !== this.state.playListUrl) {
			// console.log("up-up", prevState.playListUrl, this.state.playListUrl);
			this.handleUpdatePlaylist();
		}
	}
	componentDidMount() {
		this.handleUpdatePlaylist();
	}

	handleGetYouList = async (playListUrl: string): Promise<any> => {
		if (!("fetch" in window)) {
			console.log("Fetch API not found, try including the polyfill");
			return;
		}
		const proxyurl = "https://cors-anywhere.herokuapp.com/";

		let content: string | void = await fetch(proxyurl + playListUrl)
			.then(response => response.text())
			// .then(contents => content)
			.catch(ee => {
				if (typeof this.context !== "undefined" && this.context.showMessage) {
					this.context.showMessage({
						type: "WARNING",
						text: "It seems the server is busy. Try the server later(",
					});
				} else {
					console.log("Cant access response. Blocked by browser?", ee);
				}
			});

		if (content && content.length) {
			switch (true) {
				case /^\D*youtube.{5}watch\?.+$/.test(playListUrl):
					return Strategy.playlistWith(content);
					break;

				case /^\D*youtube.{5}playlist\?.+$/.test(playListUrl):
					return Strategy.playlist(content);
					break;

				default:
					this.context.showMessage({
						type: "WARNING",
						text: "Сan't recognize playlist",
					});
					return null;
				// break;
			}
		}

		this.context.showMessage({
			type: "WARNING",
			text: "Can`t get content from server",
		});
		return null;
	};

	handleUpdatePlaylist = async () => {
		const newList: any = await this.handleGetYouList(this.props.urlOfList);
		if (newList) {
			//save playlist to storage

			//add playlist for playing
			this.props.onSetPlayList(newList);
		}
	};

	handleShowManager = () => {
		this.setState({
			managerIsVisible: !this.state.managerIsVisible,
		});
	};

	render() {
		const { managerIsVisible } = this.state;

		const {
			onShow,
			onPlay,
			onClose,
			onSetCurrentTrack,
			onSetList,
			onSetCurrentPlaylistNumber,
		} = this.props;

		const styles = {
			flexGrow: 1,
			display: "flex",
			flexDirection: "column",
			justifyContent: "space-between",
			overflow: "hidden",
			right: onShow ? 0 : "-100%",
			// position: "relative",
		};

		return (
			<section style={styles}>
				<div className="settings-playlist_header">
					<p>Play list</p>
					<div />
					<button onClick={() => onClose("player")}>{">"}</button>
				</div>
				{managerIsVisible ? (
					<PlayListManager
						onSetCurrentPlaylistNumber={onSetCurrentPlaylistNumber}
						onSetList={onSetList}
					/>
				) : (
					<PlayList onClose={onClose} onPlay={onPlay} onSetCurrentTrack={onSetCurrentTrack} />
				)}
				<button
					type="button"
					className="play-list__main-manager-button"
					onClick={this.handleShowManager}
				>
					manager
				</button>
			</section>
		);
	}
}

export default PlayListContainer;
