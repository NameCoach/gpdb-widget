import React, { ReactElement, useEffect, useState } from "react";

import styles from "./styles.module.css";
import classNames from "classnames/bind";
import Close from "../Close";
import { TOOLTIP_HIDE_DELAY, TOOLTIP_MARGIN, TOOLTIP_SHOW_DELAY } from "../../../constants";

export enum PresentationMode {
  Left = "left",
  Right = "right",
}

export enum TooltipActionType {
  Button = "tooltip_button",
  Link = "tooltip_link",
}
interface ITooltipAction {
  actionType: TooltipActionType;
  onClick?: (value: any) => void;
}

const cx = classNames.bind(styles);

interface Props {
  title: string;
  id: string;
  base?: JSX.Element | null;
  children?: ReactElement<ITooltipAction>[] | null;
  mode?: PresentationMode;
  closable?: boolean;
  delayShow?: number;
  delayHide?: number;
  showOnClick?: boolean;
  hideOnLeave?: boolean;
  isActive?: boolean;
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
}: Props): JSX.Element => {
  let showTimeout;
  let hideTimeout;
  const [active, setActive] = useState<boolean>(isActive);

  const delayedHide = (delayHide) => {
    hideTimeout = setTimeout(() => setActive(false), delayHide);
  };

  const showTip = (e) => {
    e.stopPropagation();
    showTimeout = setTimeout(() => setActive(true), delayShow);
  };

  const hideTip = (e) => {
    e.stopPropagation();
    delayHide ? delayedHide(delayHide) : setActive(false);
  };

  const getTipStyle = () => {
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

  useEffect(() => {
    setActive(isActive);
    return () => {
      clearInterval(showTimeout);
      clearInterval(hideTimeout);
    };
  }, [isActive]);

  return (
    <div className={cx(styles.modal_wrapper)}>
      {active && (
        <div className={cx("tooltip_tip", "top", mode)} style={getTipStyle()}>
          {closable && <Close className="modal" onClick={hideTip} />}
          <div className={styles.title}>{title}</div>
          {children &&
            React.Children.map(children, (child) =>
              React.cloneElement(child as ReactElement<ITooltipAction>, {
                onClick: delayedHide,
              })
            )}
        </div>
      )}
      <div
        id={id}
        onClick={showOnClick ? showTip : null}
        onMouseLeave={hideOnLeave ? hideTip : null}
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
