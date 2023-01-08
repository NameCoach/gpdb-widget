import React from "react";
import { CardButton } from "../../../kit/Buttons";
import { Column, Row } from "../../../kit/Grid";
import { FontWeights, StyledText } from "../../../kit/Topography";
import { Library } from "../../../kit/NewIcons";
import { DARKER_BRAND } from "../../../styles/variables/colors";

interface RecorderButtonProps {
  onClick: () => any;
}

export const LibraryRecordingsButton = ({onClick}: RecorderButtonProps) => {
  return <CardButton onClick={onClick}>
    <Column gap={10}>
      <Row centered>
        <Library color={DARKER_BRAND}/>
      </Row>
      <Row centered>
        <StyledText weight={FontWeights.SemiBold}>
          Library
        </StyledText>
      </Row>
    </Column>
  </CardButton>
};
