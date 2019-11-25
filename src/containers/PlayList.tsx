import * as React from "react";

import PlayList from "../components/PlayList/index";
import PlayListManager from "../components/PlayListManager/index";

import { bodyType } from "../types/bodyType";
import { playItemType } from "../types/playItemType";
import { youtubeContentType } from "../types/youtubeContentType";
import { listOfPlaylistItemType } from "../types/listOfPlaylistItemType";
import { mainContextType } from "../types/mainContextType";

import Strategy from "../lib/strategy";
import db from "../db";

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
	playListFromStor: playItemType[];
};

class PlayListContainer extends React.Component<propsType> {
	static contextType: any = mainContext;

	state: stateType = {
		playListUrl: this.props.urlOfList,
		managerIsVisible: false,
		playListFromStor: [],
	};

	shouldComponentUpdate(nextProps: propsType, nextState: stateType): boolean {
		if (Array.isArray(nextState.playListFromStor) && nextState.playListFromStor.length) {
			this.props.onSetPlayList(nextState.playListFromStor);
		}

		return (
			JSON.stringify(nextState.playListFromStor) !== JSON.stringify(this.state.playListFromStor) ||
			this.props.urlOfList !== nextProps.urlOfList ||
			this.state.managerIsVisible !== nextState.managerIsVisible
		);
	}

	componentWillReceiveProps(newProps: propsType) {
		if (newProps.urlOfList !== this.props.urlOfList) {
			this.setState({
				playListUrl: newProps.urlOfList,
			});
		}
	}

	componentDidMount() {
		this.handleGetCurrentPlaylistFromStorage();
		this.handleUpdatePlaylist();
	}

	handleClearCurrentPlayListOnStorage = () => {
		db.removeData("currentPlayList", {});
	};

	handleSavePlayListToStorage = (newList: playItemType[]) => {
		if (Array.isArray(newList) && newList.length) {
			newList.forEach((playListItem: playItemType) => {
				db.setData("currentPlayList", { ...playListItem });
			});
		}
	};

	handleGetCurrentPlaylistFromStorage = async () => {
		const setPlaylistFunc = (params: any) => {
			if (params && params.rows && params.rows.length) {
				let playlist: listOfPlaylistItemType[] = [];

				for (let i = 0; i < params.rows.length; i++) {
					const rowItem: listOfPlaylistItemType = params.rows.item(i);
					playlist = [...playlist, rowItem];
				}
				// console.log("sett playlist from stor", playlist.length, "items");
				this.setState({
					playListFromStor: playlist,
				});
			} else {
				console.log("Storage data is empty, or:", params);
			}
		};

		await db.getData("currentPlayList", setPlaylistFunc);
	};

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

	// handleUpdatePlaylist = async () => {
	// 	const newList: any = await this.handleGetYouList(this.props.urlOfList);

	// 	let { playListFromStor } = this.state;

	// 	if (Array.isArray(newList) && newList.length) {
	// 		console.log("Get", newList.length, "play items");
	// 		newList.forEach((playitem: playItemType) => {
	// 			const itemInState: playItemType | void = this.state.playListFromStor.find(
	// 				(playitemInState: playItemType) => playitemInState.url === playitem.url,
	// 			);

	// 			if (typeof itemInState === "undefined") {
	// 				playListFromStor = [...playListFromStor, { ...playitem }];
	// 				db.setData("currentPlayList", { ...playitem });
	// 			}
	// 		});
	// 	}

	// 	if (Array.isArray(playListFromStor) && playListFromStor.length) {
	// 		this.props.onSetPlayList(playListFromStor);
	// 	}
	// };
	handleUpdatePlaylist = async () => {
		if (this.props.urlOfList) {
			const newList: any = await this.handleGetYouList(this.props.urlOfList);

			// TODO: check different between newList and this.state.playListFromStor

			if (Array.isArray(newList) && newList.length) {
				console.log("Get", newList.length, "play items");
				this.handleClearCurrentPlayListOnStorage();
				this.handleSavePlayListToStorage(newList);
				this.props.onSetPlayList(newList);
			}
		}
	};

	handleShowManager = () => {
		this.setState({
			managerIsVisible: !this.state.managerIsVisible,
		});
	};

	handleClosePlayList = () => {
		if (this.state.managerIsVisible) {
			setTimeout(() => {
				this.handleShowManager();
			}, 1000);
		}
		this.props.onClose("player");
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
					<button onClick={this.handleUpdatePlaylist}>
						<i className="fas fa-sync"></i>
					</button>
					<p>Play list</p>
					<div />
					<button onClick={this.handleClosePlayList}>
						<i className="fas fa-chevron-right"></i>
					</button>
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
