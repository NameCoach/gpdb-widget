import styled from "styled-components";
import { BUTTON_COLORS, WHITE } from "../../styles/variables/colors";
import { FontSizes, FontWeights } from "../Topography";

interface StyledButtonWrapperProps {
  // button theme
  $primary?: boolean;
  $danger?: boolean;
}

export const StyledButtonWrapper = (component) => styled(component)`
  padding: 6px 12px;
  border-width: 1px;
  border-style: solid;
  border-radius: 5px;

  font-size: ${FontSizes.Small};
  font-weight: ${FontWeights.Normal};

  border-color: ${(props: StyledButtonWrapperProps) => {
    if (props.$primary) return BUTTON_COLORS.primary;
    if (props.$danger) return BUTTON_COLORS.danger;
    return BUTTON_COLORS.default;
  }};

  color: ${(props: StyledButtonWrapperProps) => {
    if (props.$primary) return WHITE;
    if (props.$danger) return WHITE;
    return BUTTON_COLORS.default;
  }};

  background-color: ${(props: StyledButtonWrapperProps) => {
    if (props.$primary) return BUTTON_COLORS.primary;
    if (props.$danger) return BUTTON_COLORS.danger;
    return WHITE;
  }};

  cursor: pointer;

  &:hover,
  &:focus {
    border-color: ${(props: StyledButtonWrapperProps) => {
      if (props.$primary) return BUTTON_COLORS.primaryFocused;
      if (props.$danger) return BUTTON_COLORS.dangerFocused;
      return BUTTON_COLORS.defaultFocused;
    }};

    color: ${(props: StyledButtonWrapperProps) => {
      if (props.$primary) return WHITE;
      if (props.$danger) return WHITE;
      return BUTTON_COLORS.defaultFocused;
    }};

    background-color: ${(props: StyledButtonWrapperProps) => {
      if (props.$primary) return BUTTON_COLORS.primaryFocused;
      if (props.$danger) return BUTTON_COLORS.dangerFocused;
      return WHITE;
    }};
  }

  &:disabled,
  &:disabled:hover {
    border-color: ${(props: StyledButtonWrapperProps) => {
      if (props.$primary) return BUTTON_COLORS.primaryDisabled;
      if (props.$danger) return BUTTON_COLORS.dangerDisabled;
      return BUTTON_COLORS.defaultDisabled;
    }};

    color: ${(props: StyledButtonWrapperProps) => {
      if (props.$primary) return WHITE;
      if (props.$danger) return WHITE;
      return BUTTON_COLORS.defaultDisabled;
    }};

    background-color: ${(props: StyledButtonWrapperProps) => {
      if (props.$primary) return BUTTON_COLORS.primaryDisabled;
      if (props.$danger) return BUTTON_COLORS.dangerDisabled;
      return WHITE;
    }};

    cursor: default;
  }
`;
