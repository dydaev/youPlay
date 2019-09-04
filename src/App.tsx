import * as React from 'react';

import Header from './components/Header';
import Roll from './components/PlayRoll';
import Footer from './components/Footer';
import Tabs from './components/Tabs';
import Player from './components/Player';

import {bodyType} from './types/bodyType'

import { BODYTYPE } from './models/bodyType';

import './main.scss';

const Main = () => {
	const [bodyFill, setBodyFill] = React.useState<bodyType>(BODYTYPE[0]);

	const handleSetBody = (newFill: bodyType): void => {
		console.log(newFill)
	}

	return (
		<>
			<Header onClickButton={setBodyFill} bodyType={bodyFill}/>
			{bodyFill === 'list' ? <p>List</p> : bodyFill === 'settings' ? <p>Settings</p> : <p>Play</p>}
			<Roll />
			<Footer />
		</>
	);
};

export default Main;

/*
			<Tabs>
				<Player title="Player" />
				<h1 className="bla" title="List">
					Play-list
				</h1>
				<h1 className="bla" title="Settings">
					Settings
				</h1>
			</Tabs>
 */
