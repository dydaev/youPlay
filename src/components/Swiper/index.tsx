import * as React from 'react';

type ChildrenWithProps = React.ReactChild & {
  props: any;
};

export interface ISwiperProps {
  children: ChildrenWithProps;
  triggerLimit?: number;
  onSwipe?(direction: 'up' | 'down' | 'left' | 'right'): void;
  onClick?(e: MouseEvent): void;
}

const Swiper: React.FunctionComponent<ISwiperProps> = ({
  children,
  onClick,
  onSwipe,
  triggerLimit = 10,
}: ISwiperProps) => {
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
    const positionOnClick = { x, y };

    setPositionStartFlipMouseDown(positionOnClick);

    setIsTouch(true);
  };

  const handleClick = (e: any): void => {
    e.stopPropagation();
  };

  const isSwipeHorizontal = Math.abs(swipeShift.x) > Math.abs(swipeShift.y);

  const handleFlipMouseUp = (e: any): void => {
    if (
      swipeShift.x > -triggerLimit &&
      swipeShift.x < triggerLimit &&
      swipeShift.y > -triggerLimit &&
      swipeShift.y < triggerLimit
    ) {
      if (onClick && e.type !== 'touchend') onClick(e);
      // tslint:disable-next-line:curly
    } else if (onSwipe) {
      switch (true) {
        case !isSwipeHorizontal && swipeShift.y < 0:
          onSwipe('up');
          break;
        case !isSwipeHorizontal && swipeShift.y > 0:
          onSwipe('down');
          break;
        case isSwipeHorizontal && swipeShift.x < 0:
          onSwipe('left');
          break;
        case isSwipeHorizontal && swipeShift.x > 0:
          onSwipe('right');
          break;
      }
    }

    setPositionStartFlipMouseDown({ x: 0, y: 0 });
    setSwipeShift({ x: 0, y: 0 });

    setIsTouch(false);
  };

  const handleMouseMove = (e: any): void => {
    if (isTouch) {
      const x = typeof e.changedTouches === 'object' ? e.changedTouches[0].clientX : e.clientX;
      const y = typeof e.changedTouches === 'object' ? e.changedTouches[0].clientY : e.clientY;

      const mousePosition = { x, y };
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
          isSwipeTouch: isTouch,
          swipeDown: !isSwipeHorizontal && swipeShift.y > 0 ? Math.abs(swipeShift.y) : 0,
          swipeLeft: isSwipeHorizontal && swipeShift.x < 0 ? Math.abs(swipeShift.x) : 0,
          swipeRight: isSwipeHorizontal && swipeShift.x > 0 ? Math.abs(swipeShift.x) : 0,
          swipeShift,
          swipeUp: !isSwipeHorizontal && swipeShift.y < 0 ? Math.abs(swipeShift.y) : 0,
        },
      })}
    </div>
  );
};

export default Swiper;
