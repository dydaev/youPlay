import * as React from "react";

import { messageType } from "../../types/messageType.ts";

import "./style.scss";

export type props = {
	onHide(): void;
	message: messageType | null;
};

const Message = ({ message, onHide }: props) => {
	let color = "green";
	let text = "";

	if (message) {
		text = message.text;

		switch (message.type) {
			case "WARNING":
				color = "#ffd700b8";
				break;
			case "ERROR":
				color = "#ffc0cbab";
		}
		setTimeout(() => {
			onHide();
		}, 3000);
	}

	return (
		<div className="main-message" style={message ? { top: 0, background: color } : {}}>
			<p>{text || ""}</p>
		</div>
	);
};

Message.displayName = "Message";

export default Message;
