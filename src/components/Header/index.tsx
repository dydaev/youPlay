import * as React from 'react';

import { BODYTYPE } from '../../models/bodyType';

import { bodyType } from '../../types/bodyType';

import './style.scss';

type props = {
	onClickButton(bodyType: bodyType): void;
	bodyType: bodyType;
};

const Header = ({ onClickButton, bodyType }: props) => {
	return (
		<header id="main-header">
			<button
				id="settings"
				onClick={() => (bodyType !== 'settings' ? onClickButton('settings') : onClickButton('player'))}
			>
				<i className="fas fa-sliders-h"></i>
			</button>
			<h5>-=you-Player=-</h5>
			<button onClick={() => (bodyType !== 'list' ? onClickButton('list') : onClickButton('player'))}>
				<i className="fas fa-bars"></i>
			</button>
		</header>
	);
};

export default Header;
