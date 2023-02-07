import React from "react";
import styled from "styled-components";
import { BUTTON_COLORS } from "../../styles/variables/colors";
import { ReactNode } from "react";
import { FontSizes, FontWeights } from "../Topography";

const StyledLinkButton = styled.a`
  text-decoration: underline;
  color: ${BUTTON_COLORS.default};
  font-size: ${FontSizes.Small};
  font-weight: ${FontWeights.Normal};
  cursor: pointer;

  &:visited {
    color: ${BUTTON_COLORS.default};
  }

  &:hover, &:focus {
    color: ${BUTTON_COLORS.defaultFocused};
  }
`

interface LinkProps {
  children: ReactNode;
  onClick?: () => void;
}

export const Link = ({children, onClick}: LinkProps) => {
  return <StyledLinkButton onClick={onClick}>
    {children}
  </StyledLinkButton>
};
