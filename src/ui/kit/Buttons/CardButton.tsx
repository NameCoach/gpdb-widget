import React, { ReactNode } from "react";
import styled from "styled-components";

interface CardButtonProps {
  children: ReactNode;
  onClick?: () => any;
}

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background: #fff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  border: 0 solid transparent;
  padding: 12px;
  cursor: ${(props) => {
    if (props.disabled) return "default";
    return "pointer";
  }};
`;

export const CardButton = ({ children, onClick }: CardButtonProps) => {
  return <StyledButton onClick={onClick}>{children}</StyledButton>;
};
