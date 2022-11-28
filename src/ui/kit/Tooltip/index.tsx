import React from "react";
import Popup from "../Popup";
import Text from "../Popup/components/Text";
import { PopupProps } from "../Popup/types";

interface TooltipProps extends PopupProps {};

const Tooltip = ({children, ...popupProps}: TooltipProps, ref):JSX.Element => {
  return <Popup {...popupProps} ref={ref}>
    <Text>{children}</Text>
  </Popup>;
};

export default React.forwardRef(Tooltip);
