import React from "react";
import styled from "styled-components";
import * as Icons from "../NewIcons";
import { BUTTON_COLORS, WHITE } from "../../styles/variables/colors";

const RightTopCornerButton = styled.button`
  position: absolute;
  top: -7px;
  right: -7px;
  border: none;
  cursor: pointer;
  border: none;
  background-color: unset;
  padding: 0;
  margin: 0;

  height: 18px !important;
  width: 18px !important;

  color: ${BUTTON_COLORS.primary};
  fill: ${WHITE};

  &:hover,
  &:focus {
    opacity: 1;
    color: ${WHITE};
    fill: ${BUTTON_COLORS.primary};
  }
`;

interface CloseTooltipButtonProps {
  onClick?: () => void;
}

export const CloseTooltipButton = ({ onClick }: CloseTooltipButtonProps) => {
  return (
    <RightTopCornerButton onClick={onClick}>
      <Icons.CloseTooltip />
    </RightTopCornerButton>
  );
};
