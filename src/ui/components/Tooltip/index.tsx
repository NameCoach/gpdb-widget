import React, { useContext } from "react";
import ControllerContext from "../../contexts/controller";
import ReactTooltip, { TooltipProps } from "react-tooltip";
import { ConstantOverrides } from "../../customFeaturesManager";
import { DARKER_BRAND, WHITE } from "../../styles/variables/colors";
import { TOOLTIP_DELAY } from "../../../constants";
import useCustomFeatures from "../../hooks/useCustomFeatures";
import styles from "./styles.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

 interface NCProps {
  hidden?: boolean
 }

export type NCTooltipProps = TooltipProps & NCProps


const Tooltip = (props: NCTooltipProps): JSX.Element => {
  const controller = useContext(ControllerContext);
  const customFeatures = useCustomFeatures(controller);

  return (
    <ReactTooltip
      {...props}
      textColor={props.textColor || WHITE}
      backgroundColor={props.backgroundColor || DARKER_BRAND}
      delayShow={
        customFeatures.getValue(ConstantOverrides.TooltipDelay) || TOOLTIP_DELAY
      }
      className={cx(styles.tooltip, {"hidden": props.hidden})}
      multiline
    />
  );
};

export default Tooltip;
