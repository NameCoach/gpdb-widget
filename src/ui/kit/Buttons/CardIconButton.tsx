import React, { ReactNode } from "react";
import styled from "styled-components";
import { Column, Row } from "../Grid";
import { StyledText } from "../Topography";
import { DARKER_BRAND } from "../../styles/variables/colors";

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

interface CardIconButtonProps {
  onClick: () => any;
  icon: any;
  text: string;
}

export const CardIconButton = ({ onClick, icon, text }: CardIconButtonProps) => {
  const IconComponent = icon;
  
  return <StyledButton onClick={onClick}>
    <Column gap={10}>
      <Row centered>
        <IconComponent color={DARKER_BRAND}/>
      </Row>
      <Row centered>
        <StyledText semibold>
          {/* TODO: move to i18n */}
          {text}
        </StyledText>
      </Row>
    </Column>
  </StyledButton>;
};
