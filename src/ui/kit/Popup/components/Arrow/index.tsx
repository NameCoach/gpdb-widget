import React, { useContext, useEffect, useMemo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./styles.module.css";
import { IPopupContext, Offset } from "../../types";
import { PopupContext } from "../../contexts/popup_context";

const cx = classNames.bind(styles);

export const DEFAULT_ARROW = {
  width: 28,
  height: 14,
  sideOffset: 18,
  surfaceOverlay: 4,
};

const defaultStyle = {
  width: DEFAULT_ARROW.width + "px",
  height: DEFAULT_ARROW.height + "px",
};

const Arrow = (): JSX.Element => {
  const popupContext = useContext<IPopupContext>(PopupContext);
  const { openerPosition, fullWidth } = popupContext;
  const [offset, setOffset] = useState<Offset>({} as Offset);

  const computeTop = ():number => {
    return openerPosition.top - DEFAULT_ARROW.height - DEFAULT_ARROW.surfaceOverlay; // lift arrow higher then opener
  };

  const computeLeft = ():number => {
    return openerPosition.left + (openerPosition.width - DEFAULT_ARROW.width)/2;
  };

  useEffect(() => {
    const newTop = computeTop();
    const newLeft = computeLeft();

    if (offset.top !== newTop || offset.left !== newLeft) {
      const newOffset = {} as Offset;
      if (newTop) newOffset.top = newTop;
      if (newLeft) newOffset.left = newLeft;
      setOffset(newOffset);
    }
  }, [openerPosition]);

  const containerStyles = useMemo<React.CSSProperties>(() => ({
    ...offset,
    ...defaultStyle,
  }), [offset]);

  return (
    <div className={cx(styles.container, {fullWidth})} style={containerStyles}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className={cx(styles.arrow)}
      >
        <polygon
          className={cx(styles.triangle)}
          strokeLinejoin={"round"}
          points="10,0 90,0 50,90"
        />
      </svg>
    </div>
  );
};

export default Arrow;
