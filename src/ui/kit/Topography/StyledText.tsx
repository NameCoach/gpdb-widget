import styled from "styled-components";
import { DARK_GREY, LIGHT_GREY } from "../../styles/variables/colors";
import { FontSizes, FontWeights } from "./types";

interface StyledTextProps {
  // style
  weight?: FontWeights;
  semibold?: boolean;
  bold?: boolean;

  // size
  big?: boolean;
  medium?: boolean;
  small?: boolean;

  // color
  gray?: boolean;
  color?: string;
}

export const StyledText = styled.span`
  font-style: normal;

  font-weight: ${(props: StyledTextProps) => {
    if (props.weight) return props.weight;
    if (props.semibold) return FontWeights.SemiBold;
    if (props.bold) return FontWeights.Bold;
    return FontWeights.Normal;
  }};

  font-size: ${(props: StyledTextProps) => {
    if (props.big) return FontSizes.Big;
    if (props.medium) return FontSizes.Medium;
    if (props.small) return FontSizes.Small;
    return FontSizes.Small;
  }};

  color: ${(props) => {
    if (props.color) return props.color;
    if (props.gray) return LIGHT_GREY;
    return DARK_GREY;
  }};
`;
