import * as React from 'react';

import lib from '../../lib';

import './style.scss';

export interface PropsType {
  count?: number;
}
const speed = 7;
const maxStep = 8;

const Background: React.SFC<PropsType> = ({ count }: PropsType) => {
  const self = React.useRef(null);
  let widthOfBg: number, heightOfBg: number;

  React.useEffect(() => {
    widthOfBg = self.current.getBoundingClientRect().width;
    heightOfBg = self.current.getBoundingClientRect().height;
  });
  return (
    <div className="backgrounde-blob" ref={self}>
      {Array(count)
        .fill('')
        .map((_, i) => {
          const size = lib.randomInteger(1, 200);
          const x: number = lib.randomInteger(0, widthOfBg),
            y: number = lib.randomInteger(0, heightOfBg);

          return (
            <div
              key={'blobs-' + i}
              style={{
                top: y,
                left: x,
                height: size,
                width: size,
              }}
            ></div>
          );
        })}
    </div>
  );
};

Background.defaultProps = {
  count: 10,
};

export default Background;
