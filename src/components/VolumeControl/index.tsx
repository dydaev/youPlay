import * as React from 'react';

import './style.scss';

interface VolumeControlProps {
  valueLevel: number;
  isShowControll: boolean;
  onToggleVolumeControll(): void;
  onChangeVolume(newvalueLevel: number): void;
}

const VolumeControl: React.FunctionComponent<VolumeControlProps> = ({
  valueLevel,
  isShowControll,
  onToggleVolumeControll,
  onChangeVolume,
}) => {
  const [startPosition, setStartPosition] = React.useState(0);
  const [handlePosition, setHandlePosition] = React.useState(valueLevel);

  const iconHiderSize =
    valueLevel === 0
      ? 15
      : valueLevel < 0.33
      ? 18
      : valueLevel >= 0.33 && valueLevel < 0.66
      ? 24
      : 33;

  const handleMouseDown = (e: any): void => {
    if (e.target.id === 'volume-handler' || e.target.id === 'volume-handler-icon') {
      const position = typeof e.touches === 'object' ? e.touches[0].clientY : e.clientY;
      setStartPosition(position);
    }
  };
  const handleMouseMove = (e: any): void => {
    if (startPosition) {
      const currentPosition = typeof e.touches === 'object' ? e.touches[0].clientY : e.clientY;

      // const shiftHandle = currentPosition - startPosition;

      const result = currentPosition - (40 + 32) - 133;

      setHandlePosition(result > -33 ? -33 : result < -133 ? -133 : result);
    }
  };
  const handleMouseUp = (): void => {
    const newVolumeLevel = (-1 * handlePosition - 33) / 100;

    onChangeVolume(newVolumeLevel);
    setStartPosition(0);
  };

  return (
    <div className="base-component_volume-control">
      <button onClick={onToggleVolumeControll}>
        <div className="base-component_volume-control_icon-hider" style={{ width: iconHiderSize }}>
          <i className="fas fa-volume-up"></i>
        </div>
      </button>
      <div
        style={isShowControll ? { height: 100 } : {}}
        className="base-component_volume-control_control-container"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleMouseUp}
      >
        <div className="base-component_volume-control_line" />
        <div
          className="base-component_volume-control_handle"
          id="volume-handler"
          style={
            !isShowControll
              ? { top: -124 }
              : !startPosition
              ? { top: (valueLevel * 100 + 33) * -1 }
              : { top: handlePosition, transition: 'unset' }
          }
        >
          <div className="base-component_volume-control_handle_button" id="volume-handler-icon" />
        </div>
      </div>
    </div>
  );
};

export default VolumeControl;
