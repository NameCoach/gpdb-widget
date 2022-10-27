import React, { useEffect, useState } from "react";

import styles from "./styles.module.css";
import classNames from "classnames/bind";
import {
  TOOLTIP_HIDE_DELAY,
  TOOLTIP_MARGIN,
  TOOLTIP_SHOW_DELAY,
} from "../../../constants";
import { PresentationMode } from "../../../types/modal-tooltip";
import Children, { Child } from "../../../types/children-prop";
import IconButtons from "../../kit/IconButtons";

const cx = classNames.bind(styles);
const ACTIONS_CLASS_NAME = "column_actions";
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
  actionsClassName?: string;
  onShowCb?: () => void | null;
  onHideCb?: () => void | null;
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
  onShowCb = null,
  onHideCb = null,
  tipStyle,
  closeOnChildClick = true,
  actionsClassName = ACTIONS_CLASS_NAME,
}: Props): JSX.Element => {
  let showTimeout;
  let hideTimeout;

  const [active, setActive] = useState<boolean>(isActive);

  const hideWithDelay = (delayHide: number): void => {
    hideTimeout = setTimeout(() => {
      setActive(false);
      onHideCb && onHideCb();
    }, delayHide);
  };

  const hideTip = (e): void => {
    e.stopPropagation();

    if (delayHide) return hideWithDelay(delayHide);

    setActive(false);
    onHideCb && onHideCb();
  };

  const toogleActiveDelayed = (e): void => {
    if (showOnClick === false) return;

    e.stopPropagation();
    showTimeout = setTimeout(() => setActive(!active), delayShow);
    onShowCb && onShowCb();
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
          {closable && <IconButtons.CloseTooltip onClick={hideTip} />}

          {title && <div className={styles.title}>{title}</div>}

          {children && (
            <div className={cx(actionsClassName)}>
              {React.Children.map(children, (child) =>
                React.cloneElement(child, {
                  onClick: childOnClick(child),
                })
              )}
            </div>
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
