import * as React from 'react';

import mobile from 'is-mobile';

import './style.scss';

// namespace VolumeControl {
//   export let handleClickOutside: () => void;
// }

interface IVolumeControlProps {
  volumeLevel: number;
  isShowControll: boolean;
  onToggleVolumeControll(state: boolean): void;
  onChangeVolume(newvolumeLevel: number): void;
}

// interface ReactWithOutside extend React.FunctionComponent{
//   handleClickOutside(): void;
// }

const VolumeControl: React.FunctionComponent<IVolumeControlProps> = ({
  volumeLevel,
  isShowControll,
  onToggleVolumeControll,
  onChangeVolume,
}: IVolumeControlProps) => {
  const ref = React.useRef();
  const [startPosition, setStartPosition] = React.useState(0);
  const [savedVolume, setSavedVolume] = React.useState(0);
  const [handlePosition, setHandlePosition] = React.useState(0);

  const iconHiderSize =
    volumeLevel === 0
      ? 15
      : volumeLevel < 0.33
      ? 18
      : volumeLevel >= 0.33 && volumeLevel < 0.66
      ? 24
      : 33;

  const handleMouseDown = (e: any): void => {
    e.stopPropagation();

    if (e.target.id === 'volume-handler' || e.target.id === 'volume-handler-icon') {
      const position = typeof e.touches === 'object' ? e.touches[0].clientY : e.clientY;

      setStartPosition(position);
    }
  };
  const handleMouseMove = (e: any): void => {
    if (startPosition) {
      const currentPosition = typeof e.touches === 'object' ? e.touches[0].clientY : e.clientY;
      const result = currentPosition - (40 + 32) - 133;

      setHandlePosition(result > -33 ? -33 : result < -133 ? -133 : result);
    }
  };
  const handleMouseUp = (e: any): void => {
    if (mobile() && e.type === 'mouseup') return;

    const currentPosition =
      typeof e.changedTouches === 'object' ? e.changedTouches[0].clientY : e.clientY;

    if (currentPosition > 60 && currentPosition < 200) {
      const newVolumeLevel = (-1 * handlePosition - 33) / 100;

      if (newVolumeLevel === 0 && savedVolume > 0) onChangeVolume(savedVolume);
      else onChangeVolume(newVolumeLevel);

      setSavedVolume(0);
      setStartPosition(0);
    }
  };

  const handleToggleControll = (): void => {
    onToggleVolumeControll(!isShowControll);

    if (!isShowControll) {
      const startHandlerPosition = (volumeLevel * 100 + 33) * -1;
      setHandlePosition(startHandlerPosition);
    }
  };

  const handleMute = (): void => {
    setSavedVolume(volumeLevel);
    onChangeVolume(0);
  };

  useOnClickOutside(ref, (e: any) => {
    if (startPosition) {
      const newVolumeLevel = (-1 * handlePosition - 33) / 100;

      onChangeVolume(newVolumeLevel);
      setStartPosition(0);
    } else onToggleVolumeControll(false);
  });

  return (
    <div className="base-component_volume-control" ref={ref}>
      <button onClick={handleToggleControll}>
        <div
          className="base-component_volume-control_icon-hider"
          style={volumeLevel > 0 ? { width: iconHiderSize } : {}}
        >
          {volumeLevel > 0 ? (
            <i className="fas fa-volume-up"></i>
          ) : (
            <i className="fas fa-volume-mute"></i>
          )}
        </div>
      </button>
      <div
        style={isShowControll ? { height: 100 } : { padding: 0 }}
        className="base-component_volume-control_control-container"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleMouseUp}
      >
        <div className="base-component_volume-control_line">
          {volumeLevel > 0 && (
            <button
              onClick={handleMute}
              className="base-component_volume-control_handle_button_muter"
            >
              <i className="fas fa-volume-mute"></i>
            </button>
          )}
        </div>
        <div
          className="base-component_volume-control_handle"
          id="volume-handler"
          style={
            !isShowControll
              ? { top: -124 }
              : !startPosition
              ? { top: (volumeLevel * 100 + 33) * -1 }
              : { top: handlePosition, transition: 'unset' }
          }
        >
          <div className="base-component_volume-control_handle_button" id="volume-handler-icon" />
        </div>
      </div>
    </div>
  );
};

// Hook
function useOnClickOutside(ref: any, handler: any) {
  React.useEffect(() => {
    const listener = (event: any) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mouseup', listener);
    document.addEventListener('touchend', listener);

    return () => {
      document.removeEventListener('mouseup', listener);
      document.removeEventListener('touchend', listener);
    };
  });
}
export default VolumeControl;
