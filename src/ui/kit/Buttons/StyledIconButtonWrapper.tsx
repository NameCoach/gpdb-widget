import styled from "styled-components";
import { BUTTON_COLORS } from "../../styles/variables/colors";

interface StyledIconButtonWrapperProps {
  active?: boolean;
  disabled?: boolean;
}

export const StyledIconButtonWrapper = (component) => styled(component)`
  display: flex;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  padding: 0;
  margin: 0;
  cursor: pointer;

  color: ${(props: StyledIconButtonWrapperProps) =>
    props.active ? BUTTON_COLORS.primary : BUTTON_COLORS.default};

  &:disabled,
  &:disabled:hover,
  &:disabled:focus {
    cursor: default;

    color: ${BUTTON_COLORS.defaultDisabled};
  }

  &:focus,
  &:hover {
    color: ${(props: StyledIconButtonWrapperProps) => {
      if (props.active) return BUTTON_COLORS.primaryFocused;
      if (props.disabled) return BUTTON_COLORS.defaultDisabled;
      return BUTTON_COLORS.defaultFocused;
    }};
  }

  &:active {
    color: ${BUTTON_COLORS.primary};
  }

  &:active:focus,
  &:active:hover {
    color: ${BUTTON_COLORS.primaryFocused};
  }
`;
