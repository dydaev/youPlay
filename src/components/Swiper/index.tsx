import * as React from 'react';

export type SwipeType = {
  x: number;
  y: number;
};

type ChildrenWithProps = React.ReactChild & {
  props: any;
};

export interface SwiperProps {
  onSwipe?(direction: 'up' | 'down' | 'left' | 'right'): void;
  onClick?(e: MouseEvent): void;
  children: ChildrenWithProps;
}

const Swiper: React.FunctionComponent<SwiperProps> = ({ children, onClick }: SwiperProps) => {
  const [isTouch, setIsTouch] = React.useState(false);
  const [positionStartFlipMouseDown, setPositionStartFlipMouseDown] = React.useState({
    x: 0,
    y: 0,
  });
  const [swipeShift, setSwipeShift] = React.useState({
    x: 0,
    y: 0,
  });

  const handleMouseDown = (e: any): void => {
    // const componentWidth = Self.current.getBoundingClientRect().width;
    // const componentHeight = Self.current.getBoundingClientRect().height;
    const x = typeof e.changedTouches === 'object' ? e.changedTouches[0].clientX : e.clientX;
    const y = typeof e.changedTouches === 'object' ? e.changedTouches[0].clientY : e.clientY;
    const positionOnClick = { x: x, y: y };

    setPositionStartFlipMouseDown(positionOnClick);

    setIsTouch(true);
  };

  const handleClick = (e: any): void => {
    e.stopPropagation();
  };

  const handleFlipMouseUp = (e: any): void => {
    if (
      onClick &&
      swipeShift.x > -10 &&
      swipeShift.x < 10 &&
      swipeShift.y > -10 &&
      swipeShift.y < 10
    ) {
      onClick(e);
    }
    // else if () {
    //   onSwipe?(direction: 'up' | 'down' | 'left' | 'right'): void;
    // }

    setPositionStartFlipMouseDown({ x: 0, y: 0 });
    setSwipeShift({ x: 0, y: 0 });

    setIsTouch(false);
  };

  const handleMouseMove = (e: any): void => {
    if (isTouch) {
      const x = typeof e.changedTouches === 'object' ? e.changedTouches[0].clientX : e.clientX;
      const y = typeof e.changedTouches === 'object' ? e.changedTouches[0].clientY : e.clientY;

      const mousePosition = {
        x: x,
        y: y,
      };
      const mouseStartPosition = {
        x: positionStartFlipMouseDown.x,
        y: positionStartFlipMouseDown.y,
      };

      const mouseShiftPosition = {
        x: mousePosition.x - mouseStartPosition.x,
        y: mousePosition.y - mouseStartPosition.y,
      };

      setSwipeShift(mouseShiftPosition);
    }
  };

  const isSwipeHorizontal = (): boolean => Math.abs(swipeShift.x) > Math.abs(swipeShift.y);

  return (
    <div
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      onMouseUp={handleFlipMouseUp}
      onTouchEnd={handleFlipMouseUp}
      onClick={handleClick}
      style={{ width: '100%' }}
    >
      {Object.assign({}, children, {
        props: {
          ...children.props,
          swipeShift: swipeShift,
          isSwipeTouch: isTouch,
          swipeLeft: isSwipeHorizontal && swipeShift.x < 0 ? Math.abs(swipeShift.x) : 0,
          swipeRight: isSwipeHorizontal && swipeShift.x > 0 ? Math.abs(swipeShift.x) : 0,
          swipeUp: !isSwipeHorizontal && swipeShift.y < 0 ? Math.abs(swipeShift.y) : 0,
          swipeDown: !isSwipeHorizontal && swipeShift.y > 0 ? Math.abs(swipeShift.y) : 0,
        },
      })}
    </div>
  );
};

export default Swiper;
