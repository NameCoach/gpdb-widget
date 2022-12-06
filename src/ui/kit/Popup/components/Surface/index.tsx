import React, {
  CSSProperties,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import { DEFAULT_ARROW } from "../Arrow";
import classNames from "classnames/bind";
import styles from "./styles.module.css";
import { IPopupContext } from "../../types";
import { PopupContext } from "../../contexts/popup_context";
import { isEqual } from "lodash";

const cx = classNames.bind(styles);

const SURFACE_DEFAULT = {
  paddingLeft: 15,
  paddingRight: 15,
};

interface SurfaceProps {
  children?: React.ReactNode;
}

const Surface = ({ children }: SurfaceProps, ref): JSX.Element => {
  const [container, setContainer] = useState<HTMLDivElement>();
  const containerRef = useCallback((ref) => { setContainer(ref) }, []);
  const popupContext = useContext<IPopupContext>(PopupContext);
  const { fullWidth, openerPosition, rightArrow, leftArrow, placeholderPosition, arrowSideOffset } = popupContext;
  const [containerStyles, setContainerStyles] = useState<CSSProperties>({});

  const computeLeft = (): number => {
    // if (fullWidth) return null;

    const containerWidth = container.offsetWidth;
    const sideOffset = typeof arrowSideOffset === "number" ? arrowSideOffset : DEFAULT_ARROW.sideOffset;

    if (fullWidth) return placeholderPosition.left + SURFACE_DEFAULT.paddingLeft;
    if (rightArrow) return openerPosition.right - containerWidth - (openerPosition.width - DEFAULT_ARROW.width)/2 + sideOffset;
    if (leftArrow) return openerPosition.left + (openerPosition.width - DEFAULT_ARROW.width)/2 - sideOffset;

    return openerPosition.left + (openerPosition.width - containerWidth)/2;
  };

  const computeTop = ():number => {
    const containerHeight = container.offsetHeight;
    return openerPosition.top - DEFAULT_ARROW.height - containerHeight;
  };

  const computeWidth = ():number => {
    if (!fullWidth) return;

    const availableWidth = placeholderPosition.width;
    const occupiedWidth = availableWidth - SURFACE_DEFAULT.paddingLeft - SURFACE_DEFAULT.paddingRight;

    return occupiedWidth;
  };
  
  useLayoutEffect(() => {
    if (container) {
      // lift surface higher then opener and arrow
      const newTop = computeTop();
      const newLeft = computeLeft();
      const newWidth = computeWidth() + "px";

      const newStyles = {} as CSSProperties;
      
      if (newTop) newStyles.top = newTop;

      if (newLeft) newStyles.left = newLeft;

      if (newWidth) newStyles.width = newWidth;

      if (!isEqual(containerStyles, newStyles)) setContainerStyles(newStyles);
    }
  }, [container, openerPosition, fullWidth, placeholderPosition]);

  return (
    <div
      className={cx(styles.container, { fullWidth, notFullWidth: !fullWidth })}
      ref={ref}
      style={containerStyles}
    >
      <div className={cx(styles.surface)} ref={containerRef}>
        {children}
      </div>
    </div>
  );
};

export default React.forwardRef<HTMLDivElement, SurfaceProps>(Surface);
