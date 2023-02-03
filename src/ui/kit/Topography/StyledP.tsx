import styled from "styled-components";
import { FontSizes, FontWeights } from "./types";
import { DARK_GREY, LIGHT_GREY } from "../../styles/variables/colors";

interface StyledPProps {
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

  // text-align
  textLeft?: boolean;
}

export const StyledP = styled.p`
  font-style: normal;

  font-weight: ${(props: StyledPProps) => {
    if (props.weight) return props.weight;
    if (props.semibold) return FontWeights.SemiBold;
    if (props.bold) return FontWeights.Bold;
    return FontWeights.Normal;
  }};

  font-size: ${(props: StyledPProps) => {
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

  text-align: ${(props) => {
    if (props.textLeft) return "left";
    return "center";
  }};
  
  padding: ${(props) => props.padding || 0};
  margin: ${(props) => props.margin || 0};
`;
