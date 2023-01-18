import styled from "styled-components";
import { DANGER_RED, DARKER_BRAND, DARK_GREY, WHITE } from "../../styles/variables/colors";
import { FontSizes, FontWeights } from "../Topography";

interface StyledButtonProps {
  // button theme
  primary?: boolean;
  danger?: boolean;
}

export const Button = styled.button`
  padding: 6px 12px;
  border-width: 1px;
  border-style: solid;
  border-radius: 5px;

  font-size: ${FontSizes.Small};
  font-weight: ${FontWeights.Normal};

  border-color: ${(props: StyledButtonProps) => {
    if (props.primary) return DARKER_BRAND;
    if (props.danger) return DANGER_RED;
    return DARK_GREY;
  }};

  color: ${(props: StyledButtonProps) => {
    if (props.primary) return WHITE;
    if (props.danger) return WHITE;
    return DARK_GREY;
  }};

  background-color: ${(props: StyledButtonProps) => {
    if (props.primary) return DARKER_BRAND;
    if (props.danger) return DANGER_RED;
    return WHITE;
  }};

  cursor: pointer;
`;
