import * as React from "react";

import { BODYTYPE } from "../../models/bodyType";

import { bodyType } from "../../types/bodyType";

import "./style.scss";

type props = {
	onClickButton(bodyType: bodyType): void;
	bodyType: bodyType;
	isShow: boolean;
};

const Header = ({ onClickButton, bodyType, isShow }: props) => {
	const styleOfShowHeader = {
		top: 0,
		// position: "static",
	};

	return (
		<header id="main-header" style={isShow ? styleOfShowHeader : {}}>
			<button
				id="settings"
				onClick={() =>
					bodyType !== "settings" ? onClickButton("settings") : onClickButton("player")
				}
			>
				<i className="fas fa-tools"></i>
			</button>
			<h5>-=plaYoi=-</h5>
			<button
				onClick={() => (bodyType !== "list" ? onClickButton("list") : onClickButton("player"))}
			>
				<i className="fas fa-bars"></i>
			</button>
		</header>
	);
};

export default Header;
