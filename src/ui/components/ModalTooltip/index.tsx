import React, { useEffect, useState } from "react";

import styles from "./styles.module.css";
import classNames from "classnames/bind";
import { TOOLTIP_HIDE_DELAY, TOOLTIP_SHOW_DELAY } from "../../../constants";
import { PresentationMode } from "../../../types/modal-tooltip";
import Children, { Child } from "../../../types/children-prop";
import IconButtons from "../../kit/IconButtons";
import userAgentManager from "../../../core/userAgentManager";

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
  showOnMouseEnter?: boolean;
  hideOnMouseLeave?: boolean;
  isActive?: boolean;
  tipStyle?: React.CSSProperties;
  wrapperStyle?: React.CSSProperties;
  baseWrapperStyle?: React.CSSProperties;
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
  showOnMouseEnter = false,
  hideOnMouseLeave = false,
  onShowCb = null,
  onHideCb = null,
  tipStyle,
  wrapperStyle,
  baseWrapperStyle,
  closeOnChildClick = true,
  actionsClassName = ACTIONS_CLASS_NAME,
}: Props): JSX.Element => {
  const { isDeprecated: old } = userAgentManager;

  let showTimeout;
  let hideTimeout;

  const [active, setActive] = useState<boolean>(isActive);

  const hideWithDelay = (delayHide: number): void => {
    hideTimeout = setTimeout(() => {
      setActive(false);
      onHideCb && onHideCb();
    }, delayHide);
  };

  const showWithDelay = (delayShow: number): void => {
    hideTimeout = setTimeout(() => {
      setActive(true);
      onShowCb && onShowCb();
    }, delayShow);
  };

  const hideTip = (e): void => {
    e.stopPropagation();

    if (delayHide) return hideWithDelay(delayHide);

    setActive(false);
    onHideCb && onHideCb();
  };

  const showTip = (e): void => {
    e.stopPropagation();

    if (delayShow) return showWithDelay(delayShow);

    setActive(true);
    onShowCb && onShowCb();
  };

  const onMouseLeave = (e): void => {
    if (hideOnMouseLeave === false) return;

    hideTip(e);
  };

  const onMouseEnter = (e) => {
    if (showOnMouseEnter === false) return;

    showTip(e);
  };

  const onClick = (e) => {
    if (showOnClick === false) return;

    e.stopPropagation();
    showTimeout = setTimeout(() => setActive(!active), delayShow);
    onShowCb && onShowCb();
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
    <div
      className={cx(styles.modal_wrapper)}
      style={wrapperStyle}
      onMouseLeave={onMouseLeave}
    >
      {active && (
        <div
          className={cx(styles.tooltip_tip, "top", mode, { closable, old })}
          style={tipStyle}
        >
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
      <div
        id={id}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        className={cx(styles.base_component_wrapper, baseWrapperStyle, {
          closable,
        })}
      >
        {base &&
          React.cloneElement(base, {
            active,
          })}
      </div>
    </div>
  );
};

export default ModalTooltip;
