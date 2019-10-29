import * as React from 'react';
import MainContext from '../../context';

import { settingsType } from '../../types/settingsType';
import { mainContextType } from '../../types/mainContextType';

import './style.scss';

type propsType = {
  onSetSettings(newSettings: settingsType): void;
};

const Settings = ({ onSetSettings }: propsType) => {
  const mainContext: mainContextType = React.useContext<mainContextType>(MainContext);
  const [settings, setSettings] = React.useState<settingsType>(mainContext.settings);

  const handleSaveSettings = () => {
    onSetSettings(settings);
  };

  const handleChangeSettings = ({ target }: any) => {
    setSettings({
      ...settings,
      [target.id]: target.type === 'checkbox' ? target.checked : target.value,
    });
  };

  return (
    <section id="main-settings">
      <label>
        Play in tray
        <input id="playInTray" type="checkbox" checked={settings.playInTray} onChange={handleChangeSettings} />
      </label>
      <label>
        Full Screen Mode
        <input id="fullScreenMode" type="checkbox" checked={settings.fullScreenMode} onChange={handleChangeSettings} />
      </label>
      <label>
        Load from youtube
        <input
          id="directYoutubeLoad"
          type="checkbox"
          checked={settings.directYoutubeLoad}
          onChange={handleChangeSettings}
        />
      </label>
      <button onClick={handleSaveSettings}>Save</button>
    </section>
  );
};

export default Settings;
