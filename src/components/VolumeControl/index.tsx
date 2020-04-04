import * as React from 'react';

import './style.scss';

interface VolumeControlProps {
  valueLevel: number;
  onChangeVolume(newvalueLevel: number): void;
}

const VolumeControl: React.FunctionComponent<VolumeControlProps> = ({
  valueLevel,
  onChangeVolume,
}) => {
  const [isOpen, setOpen] = React.useState(false);
  const [startPosition, setStartPosition] = React.useState(0);
  const [handlePosition, setHandlePosition] = React.useState(valueLevel);

  const handleToggleOpen = (): void => setOpen(!isOpen);

  const iconHiderSize =
    valueLevel === 0
      ? 15
      : valueLevel < 0.33
      ? 18
      : valueLevel >= 0.33 && valueLevel < 0.66
      ? 24
      : 33;

  const handleMouseDown = (e: any): void => {
    if (e.target.id === 'volume-handler') {
      const position = typeof e.touches === 'object' ? e.touches[0].clientY : e.clientY;
      setStartPosition(position);
    }
  };
  const handleMouseMove = (e: any): void => {
    if (startPosition) {
      const currentPosition = typeof e.touches === 'object' ? e.touches[0].clientY : e.clientY;

      const shiftHandle = currentPosition - startPosition;

      const result = valueLevel + shiftHandle - 60;

      setHandlePosition(result > -22 ? -22 : result < -122 ? -122 : result);
    }
  };
  const handleMouseUp = (e: any): void => {
    const newVolumeLevel = (-1 * handlePosition - 22) / 100;
    onChangeVolume(newVolumeLevel);
    setStartPosition(0);
  };

  return (
    <div className="base-component_volume-control">
      <button onClick={handleToggleOpen}>
        <div className="base-component_volume-control_icon-hider" style={{ width: iconHiderSize }}>
          <i className="fas fa-volume-up"></i>
        </div>
      </button>
      <div
        style={isOpen ? { height: 100 } : {}}
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
          id="volume-handler"
          className="base-component_volume-control_handle"
          style={
            !isOpen
              ? { top: -124 }
              : !startPosition
              ? { top: (valueLevel * 100 + 22) * -1 }
              : { top: handlePosition, transition: 'unset' }
          } // ((valueLevel * 100) + 22) * -1
        />
      </div>
    </div>
  );
};

export default VolumeControl;
