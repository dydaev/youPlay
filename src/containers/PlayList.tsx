import * as React from "react";

import PlayList from "../components/PlayList/index";
import PlayListManager from "../components/PlayListManager/index";

import { bodyType } from "../types/bodyType";
import { playItemType } from "../types/playItemType";
import { youtubeContentType } from "../types/youtubeContentType";
import { listOfPlaylistItemType } from "../types/listOfPlaylistItemType";
import { mainContextType } from "../types/mainContextType";

import Strategy from "../lib/strategy";
import lib from "../lib/index";
import db from "../db";

import mainContext from "../context";

type propsType = {
	context?: mainContextType;
	onShow: boolean;
	urlOfList: string;
	onClose(type: bodyType): void;
	onGetPleyListFromStorage(): void;
	onPlay(trackNumber: number): void;
	onSetCurrentTrack(trackNumber: number): void;
	onSetPlayList(playlist: playItemType[]): void;
	onSetCurrentPlaylistNumber(number: number): void;
	onSetList(playList: listOfPlaylistItemType[]): void;
};
type stateType = {
	isLoading: boolean;
	playListUrl: string;
	managerIsVisible: false;
	playListFromStor: playItemType[];
};

class PlayListContainer extends React.Component<propsType> {
	static contextType: any = mainContext;

	state: stateType = {
		isLoading: false,
		playListUrl: this.props.urlOfList,
		managerIsVisible: false,
		playListFromStor: [],
	};

	shouldComponentUpdate(
		nextProps: propsType,
		nextState: stateType,
		nextContext: mainContextType,
	): boolean {
		const { equal } = lib;

		return (
			!equal(nextState.playListFromStor, this.state.playListFromStor) ||
			!equal(nextContext.playList, this.context.playList) ||
			JSON.stringify(nextState.playListFromStor) !== JSON.stringify(this.state.playListFromStor) ||
			this.props.urlOfList !== nextProps.urlOfList ||
			this.state.managerIsVisible !== nextState.managerIsVisible ||
			this.state.isLoading !== nextState.isLoading
		);
	}

	UNSAFE_componentWillReceiveProps(newProps: propsType) {
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
				// let playlist: listOfPlaylistItemType[] = [];
				let playlist: playItemType[] = [];

				for (let i = 0; i < params.rows.length; i++) {
					const rowItem: playItemType = params.rows.item(i);
					playlist = [...playlist, rowItem];
				}
				this.props.onSetPlayList(playlist);
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

	handleSetLoading = (is: boolean) => {
		this.setState({
			isLoading: is,
		});
	};

	handleUpdatePlaylist = async (url: string = undefined) => {
		if (this.props.urlOfList) {
			this.handleSetLoading(true);
			const newList: any = await this.handleGetYouList(url ? url : this.props.urlOfList);
			this.handleSetLoading(false);
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
		const { managerIsVisible, isLoading } = this.state;

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
					<button onClick={() => this.handleUpdatePlaylist()} className={isLoading ? "rotate" : ""}>
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
						onGetPleyListFromStorage={this.props.onGetPleyListFromStorage}
						onUpdatePlaylist={this.handleUpdatePlaylist}
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
