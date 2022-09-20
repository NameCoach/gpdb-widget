import React, { useEffect, useState } from "react";

import styles from "./styles.module.css";
import classNames from "classnames/bind";
import Close from "../Close";
import {
  TOOLTIP_HIDE_DELAY,
  TOOLTIP_MARGIN,
  TOOLTIP_SHOW_DELAY,
} from "../../../constants";
import { PresentationMode } from "../../../types/modal-tooltip";
import Children, { Child } from "../../../types/children-prop";

const cx = classNames.bind(styles);

interface Props {
  title?: string;
  id: string;
  base?: JSX.Element | null;
  children?: Children;
  mode?: PresentationMode;
  closable?: boolean;
  delayShow?: number;
  delayHide?: number;
  showOnClick?: boolean;
  hideOnLeave?: boolean;
  isActive?: boolean;
  tipStyle?: React.CSSProperties;
  closeOnChildClick?: boolean;
}

const ModalTooltip = ({
  title,
  id,
  isActive = false,
  base = null,
  children = null,
  mode = PresentationMode.Right,
  closable = false,
  delayShow = TOOLTIP_SHOW_DELAY,
  delayHide = TOOLTIP_HIDE_DELAY,
  showOnClick = false,
  hideOnLeave = false,
  tipStyle,
  closeOnChildClick = true,
}: Props): JSX.Element => {
  let showTimeout;
  let hideTimeout;

  const [active, setActive] = useState<boolean>(isActive);

  const hideWithDelay = (delayHide: number): void => {
    hideTimeout = setTimeout(() => setActive(false), delayHide);
  };

  const hideTip = (e): void => {
    e.stopPropagation();
    delayHide ? hideWithDelay(delayHide) : setActive(false);
  };

  const toogleActiveDelayed = (e): void => {
    if (showOnClick === false) return;

    e.stopPropagation();
    showTimeout = setTimeout(() => setActive(!active), delayShow);
  };

  const onMouseLeave = (e): void => {
    if (hideOnLeave === false) return;

    hideTip(e);
  };

  const getTipStyle = (): React.CSSProperties => {
    if (tipStyle) return tipStyle;

    const node = document.getElementById(id);

    if (!node) return {};

    const { height } = node.getBoundingClientRect();

    const [currentLeft, currentRight] =
      mode === PresentationMode.Right ? ["auto", "0"] : ["0", "auto"];

    return {
      left: currentLeft,
      right: currentRight,
      bottom: `${height + TOOLTIP_MARGIN}px`,
      top: "auto",
    };
  };

  const childOnClick = (child: Child) => (): void => {
    const { onClick: _onClick } = child?.props || {};
    _onClick && _onClick();

    if (closeOnChildClick === true) hideWithDelay(delayHide);
  };

  useEffect(() => {
    setActive(isActive);

    return (): void => {
      clearInterval(showTimeout);
      clearInterval(hideTimeout);
    };
  }, [isActive]);

  return (
    <div className={cx(styles.modal_wrapper)}>
      {active && (
        <div className={cx("tooltip_tip", "top", mode)} style={getTipStyle()}>
          {closable && <Close className="modal" onClick={hideTip} />}
          {title && <div className={styles.title}>{title}</div>}
          {children &&
            React.Children.map(children, (child) =>
              React.cloneElement(child, {
                onClick: childOnClick(child),
              })
            )}
        </div>
      )}
      <div id={id} onClick={toogleActiveDelayed} onMouseLeave={onMouseLeave}>
        {base &&
          React.cloneElement(base, {
            active,
          })}
      </div>
    </div>
  );
};

export default ModalTooltip;
