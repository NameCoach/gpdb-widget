import React from "react";
import styled from "styled-components";
import * as Icons from "../NewIcons";

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
