import * as React from "react";

import db from "../../db";

import { settingsModel } from "../../models/settingsModel";

import { bodyType } from "../../types/bodyType";
import { settingsType } from "../../types/settingsType";

import "./style.scss";

type PropsType = {
  version: string;
  mainSettings: settingsType;
  onShow: boolean;
  onSetSettings(newSettings: settingsType): void;
  onClose(type: bodyType): void;
};
type StateType = {
  settings: settingsType;
};

class Settings extends React.Component<PropsType, StateType> {
  state = {
    settings: { ...this.props.mainSettings },
  };

  shouldComponentUpdate(nextProps: PropsType, nextState: StateType) {
    return (
      JSON.stringify(nextState.settings) !== JSON.stringify(this.state.settings) ||
      JSON.stringify(nextProps.onShow) !== JSON.stringify(this.props.onShow)
    );
  }

  UNSAFE_componentWillReceiveProps(nextProps: PropsType) {
    if (JSON.stringify(nextProps.mainSettings) !== JSON.stringify(this.props.mainSettings)) {
      this.setState({
        settings: nextProps.mainSettings,
      });
    }
  }

  setSettings = (newSettings: settingsType) => {
    this.setState({
      settings: { ...newSettings },
    });
  };

  settingsInStorage = (anySettings: any) => {
    console.log("any settings", anySettings);
  };

  getAllSettingsFromStorage = async () => {
    const setSettingsFunc = (params: any): void => {
      let tempSetting: settingsType;
      if (params && params.rows && params.rows.length) {
        for (let i = 0; i < params.rows.length; i++) {
          const rowItem: { setting: string; value: any } = params.rows.item(i);
          tempSetting = {
            ...tempSetting,
            [rowItem.setting]: rowItem.value == "true",
          };
        }
      }
      this.setSettings(tempSetting);
    };
    db.getData("settings", setSettingsFunc);
  };

  handleAddSettingToStorage = (name: string, value: any) => {
    db.setData("settings", { setting: name, value: value });
    console.log("add setting item");
  };
  handleRemoveSettingOnStorage = (name: string, value: any) => {
    db.removeData("settings", { setting: name, value: value });
    console.log("remove setting item");
  };
  handleUpdateSettingOnStorage = (name: string, value: any) => {
    db.updateData("settings", { setting: name }, { setting: name, value: value });
    console.log("update setting item");
  };

  handleResetSettings = () => {
    this.props.onSetSettings(settingsModel);
  };

  handleSaveSettings = async () => {
    Object.keys(this.state.settings).forEach((settingName: string) => {
      // @ts-ignore
      this.handleUpdateSettingOnStorage(settingName, this.state.settings[settingName]);
    });
    //let settingsTemp = await getAllSettingsFromStorage();
    this.props.onSetSettings(this.state.settings);
  };

  handleCancelSettings = () => {
    this.setSettings(this.props.mainSettings);
  };
  handleChangeSettings = ({ target }: any) => {
    this.setSettings({
      ...this.state.settings,
      [target.id]: target.type === "checkbox" ? target.checked : target.value,
    });
  };

  render() {
    const { settings } = this.state;
    const { onShow, onClose } = this.props;

    return (
      <section id="main-settings" style={{ left: onShow ? 0 : "-100%" }}>
        <div className="settings-playlist_header">
          <button onClick={() => onClose("player")}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <div />
          <p>Settings</p>
        </div>
        <div>
          <label>
            Waiting of downloading track
            <input
              id="timeoutOfReadingFile"
              type="number"
              value={settings.timeoutOfReadingFile}
              onChange={this.handleChangeSettings}
            />
          </label>
          <label>
            Play in tray
            <input
              id="playInTray"
              type="checkbox"
              checked={settings.playInTray}
              onChange={this.handleChangeSettings}
            />
          </label>
          <label>
            Full Screen Mode
            <input
              id="fullScreenMode"
              type="checkbox"
              checked={settings.fullScreenMode}
              onChange={this.handleChangeSettings}
            />
          </label>
          <label>
            Use downloading server
            <input
              id="directYoutubeLoad"
              type="checkbox"
              checked={settings.directYoutubeLoad}
              onChange={this.handleChangeSettings}
            />
          </label>
          <label>
            Server of downloading
            <input
              id="downloadServer"
              type="text"
              value={settings.downloadServer}
              onChange={this.handleChangeSettings}
            />
          </label>
          <div className="version">
            <span>version:{this.props.version}</span>
          </div>
          <div>
            <button onClick={this.handleSaveSettings}>Save</button>
            <button onClick={this.handleCancelSettings}>Cancel</button>
          </div>
        </div>
      </section>
    );
  }
}

export default Settings;
