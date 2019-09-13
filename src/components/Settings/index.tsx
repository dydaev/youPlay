import * as React from 'react';
import MainContext from '../../context';

import {settingsType} from '../../types/settingsType'
import { mainContextType } from '../../types/mainContextType';

import './style.scss';

type propsType = {
    onSetSettings(newSettings: settingsType): void
}

const Settings = ({onSetSettings}: propsType) => {
    const mainContext: mainContextType = React.useContext<mainContextType>(MainContext);
    const [settings, setSettings] = React.useState<settingsType>(mainContext.settings);

    const handleSaveSettings = () => {
        onSetSettings(settings)
    }

    const handleChangeSettings = ({target}: any) => {
        setSettings({
            ...settings,
            [target.id]: target.type === "checkbox" ? target.checked : target.value
        })
    }

	return (
		<section>
		    <label>Load from youtube
		        <input id="directYoutubeLoad" type="checkbox" checked={settings.directYoutubeLoad} onChange={handleChangeSettings}/>
		    </label>
		</section>
	);
};

export default Settings;