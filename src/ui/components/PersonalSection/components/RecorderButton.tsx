import React from "react";
import { CardButton } from "../../../kit/Buttons";
import { Column, Row } from "../../../kit/Grid";
import { StyledText } from "../../../kit/Topography";
import { Mic } from "../../../kit/NewIcons";
import { DARKER_BRAND } from "../../../styles/variables/colors";

interface RecorderButtonProps {
  onClick: () => any;
}

export const RecorderButton = ({onClick}: RecorderButtonProps) => {
  return <CardButton onClick={onClick}>
    <Column gap={10}>
      <Row centered>
        <Mic color={DARKER_BRAND}/>
      </Row>
      <Row centered>
        <StyledText semibold>
          {/* TODO: move to i18n */}
          Record
        </StyledText>
      </Row>
    </Column>
  </CardButton>
};
