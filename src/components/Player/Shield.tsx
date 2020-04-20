import * as React from 'react';

interface ShieldProps {
  onSwipe?(direction: string): void;
  wipeLeft?: number;
  swipeRight?: number;
  swipeUp?: number;
  swipeDown?: number;
}

const Shield: React.FunctionComponent<ShieldProps> = props => {
  //   console.log(props);

  return <div className="base-component_player-shield" />;
};

export default Shield;
