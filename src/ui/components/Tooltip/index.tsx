import React, { useContext } from "react";
import ControllerContext from "../../contexts/controller";
import ReactTooltip, { TooltipProps } from "react-tooltip";
import { ConstantOverrides } from "../../customFeaturesManager";
import { BRAND, WHITE } from "../../styles/variables/colors";
import { TOOLTIP_DELAY } from "../../../constants";
import useCustomFeatures from "../../hooks/useCustomFeatures";

const Tooltip = (props: TooltipProps): JSX.Element => {
  const controller = useContext(ControllerContext);
  const customFeatures = useCustomFeatures(controller);

  return (
    <ReactTooltip
      {...props}
      textColor={props.textColor || WHITE}
      backgroundColor={props.backgroundColor || BRAND}
      delayShow={
        customFeatures.getValue(ConstantOverrides.TooltipDelay) || TOOLTIP_DELAY
      }
      multiline
    />
  );
};

export default Tooltip;
