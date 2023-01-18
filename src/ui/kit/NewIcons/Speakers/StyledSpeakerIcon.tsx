import styled from "styled-components";
import { DARKER_BRAND, DARK_BRAND, DARK_GREY, LIGHT_GREY } from "../../../styles/variables/colors";

interface StyledSpeakerIconProps {
  disabled?: boolean;
  active?: boolean;
}

export const StyledSpeakerIcon = IconComponent => styled(IconComponent)`
stroke: ${(props: StyledSpeakerIconProps) => {
  if (props.disabled) return LIGHT_GREY;
  if (props.active) return DARKER_BRAND;
  return "#6A6A6A";
}};

&:hover {
  stroke: ${(props: StyledSpeakerIconProps) => {
    if (props.disabled) return LIGHT_GREY;
    if (props.active) return DARK_BRAND;
    return DARK_GREY;
  }}
}
`;
