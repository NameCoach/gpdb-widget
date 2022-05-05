import React, { useContext } from "react";
import ControllerContext from "../../contexts/controller";
import StyleContext from "../../contexts/style";
import loadCustomFeatures from "../../hooks/loadCustomFatures";
import ReactTooltip, { TooltipProps } from "react-tooltip";
import { BRAND_COLOR, WHITE_COLOR, TOOLTIP_DELAY } from "../../../constants";
import { ConstantOverrides } from "../../customFeaturesManager";

const Tooltip = (props: TooltipProps): JSX.Element => {
  const controller = useContext(ControllerContext);
  const styleContext = useContext(StyleContext);
  const customFeatures =
    styleContext.customFeatures ||
    loadCustomFeatures(controller?.preferences?.custom_features);

  return (
    <ReactTooltip
      {...props}
      textColor={props.textColor || WHITE_COLOR}
      backgroundColor={props.backgroundColor || BRAND_COLOR}
      delayShow={
        customFeatures.getValue(ConstantOverrides.TooltipDelay) || TOOLTIP_DELAY
      }
      multiline
    />
  );
};

export default Tooltip;
