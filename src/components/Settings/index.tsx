import * as React from "react";
import MainContext from "../../context";

import { bodyType } from "../../types/bodyType";
import { settingsType } from "../../types/settingsType";
import { mainContextType } from "../../types/mainContextType";

import "./style.scss";

type propsType = {
  onShow: boolean;
  onSetSettings(newSettings: settingsType): void;
  onClose(type: bodyType): void;
};

const Settings = ({ onSetSettings, onClose, onShow }: propsType) => {
  const mainContext: mainContextType = React.useContext<mainContextType>(MainContext);
  const [settings, setSettings] = React.useState<settingsType>(mainContext.settings);

  const handleSaveSettings = () => {
    onSetSettings(settings);
  };

  const handleCancelSettings = () => {
    setSettings(mainContext.settings);
  };
  const handleChangeSettings = ({ target }: any) => {
    setSettings({
      ...settings,
      [target.id]: target.type === "checkbox" ? target.checked : target.value,
    });
  };

  return (
    <section id="main-settings" style={{ left: onShow ? 0 : "-100%" }}>
      <div className="settings-playlist_header">
        <button onClick={() => onClose("player")}>{"<"}</button>
        <div />
        <p>Settings</p>
      </div>
      <div>
        <label>
          Play in tray
          <input
            id="playInTray"
            type="checkbox"
            checked={settings.playInTray}
            onChange={handleChangeSettings}
          />
        </label>
        <label>
          Full Screen Mode
          <input
            id="fullScreenMode"
            type="checkbox"
            checked={settings.fullScreenMode}
            onChange={handleChangeSettings}
          />
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
        <div>
          <button onClick={handleSaveSettings}>Save</button>
          <button onClick={handleCancelSettings}>Cancel</button>
        </div>
      </div>
    </section>
  );
};

export default Settings;
