import styled from "styled-components";
import { ReactComponent as Icon } from "./icons/close_tooltip.svg";
import { DARKER_BRAND, WHITE } from "../../styles/variables/colors";

export const CloseTooltip = styled(Icon)`
  height: 18px !important;
  width: 18px !important;

  color: ${DARKER_BRAND};
  fill: ${WHITE};

  &:hover {
    opacity: 1;
    color: ${WHITE};
    fill: ${DARKER_BRAND};
  }
`;
