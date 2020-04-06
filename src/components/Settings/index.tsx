import * as React from 'react';

import Tabs from '../Tabs';

import { settingsModel } from '../../models/settingsModel';

import { bodyType } from '../../types/bodyType';
import { settingsType } from '../../types/settingsType';

import './style.scss';
import lib from '../../lib';

type PropsType = {
  version: string;
  mainSettings: settingsType;
  isShow: boolean;
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

  shouldComponentUpdate(nextProps: PropsType, nextState: StateType): boolean {
    console.log();

    return (
      !lib.equal(nextProps.mainSettings, this.props.mainSettings) ||
      !lib.equal(nextState.settings, this.state.settings) ||
      nextProps.isShow !== this.props.isShow
    );
  }

  UNSAFE_componentWillReceiveProps(nextProps: PropsType): void {
    if (!lib.equal(nextProps.mainSettings, this.props.mainSettings)) {
      this.setState({
        settings: nextProps.mainSettings,
      });
    }
  }

  setSettings = (newSettings: settingsType): void => {
    this.setState({
      settings: { ...newSettings },
    });
  };

  settingsInStorage = (anySettings: any): void => {
    console.log('any settings', anySettings);
  };

  handleResetSettings = (): void => {
    this.props.onSetSettings(settingsModel);
  };

  handleSaveSettings = async (): Promise<void> => {
    //let settingsTemp = await getAllSettingsFromStorage();
    this.props.onSetSettings(this.state.settings);
  };

  handleCancelSettings = (): void => {
    this.setSettings(this.props.mainSettings);
  };
  handleChangeSettings = ({ target }: any): void => {
    this.setSettings({
      ...this.state.settings,
      [target.id]: target.type === 'checkbox' ? target.checked : target.value,
    });
  };
  handleChageLang = (e: any): void => {
    console.log(e.target.value);
  };

  render(): React.ReactNode {
    const { settings } = this.state;
    const { isShow, mainSettings } = this.props;

    if (false) {
      //settings.language === ''
      const systemLang = navigator.language.toLowerCase().split('-')[0];

      this.handleChageLang({ target: { value: systemLang } });
    }

    const settingsChanged = !lib.equal(settings, mainSettings);

    return (
      <section id="main-settings" style={{ left: isShow ? 0 : '-100%' }}>
        <Tabs buttonHeight={60}>
          <div title="General" className="main-settings_tab-item">
            <label>
              Language
              <select onChange={this.handleChageLang}>
                <option value="sys">System({navigator.language})</option>
                <option value="ua">Українська</option>
                <option value="en">English</option>
                <option value="ru">Русский</option>
              </select>
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
              Use third party server for playlist(often busy!)
              <input
                id="thirdPartyServerForPlaylist"
                type="checkbox"
                checked={settings.thirdPartyServerForPlaylist}
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
              Play in tray(experemental)
              <input
                id="playInTray"
                type="checkbox"
                checked={settings.playInTray}
                onChange={this.handleChangeSettings}
              />
            </label>
          </div>
          <div title="Audio" className="main-settings_tab-item">
            <label>
              Waiting of downloading track
              <input
                id="timeoutOfReadingFile"
                type="number"
                value={settings.timeoutOfReadingFile}
                onChange={this.handleChangeSettings}
              />
            </label>
          </div>
          <div title="Video" className="main-settings_tab-item">
            <label>
              Show video
              <input
                id="showVideo"
                type="checkbox"
                checked={settings.showVideo}
                onChange={this.handleChangeSettings}
              />
            </label>
          </div>
        </Tabs>
        <div>
          <div className="version">
            <span>version:{this.props.version}</span>
          </div>
          <div>
            <button style={settingsChanged ? { left: 0 } : {}} onClick={this.handleSaveSettings}>
              Save
            </button>
            <button style={settingsChanged ? { right: 0 } : {}} onClick={this.handleCancelSettings}>
              Cancel
            </button>
          </div>
        </div>
      </section>
    );
  }
}

export default Settings;
