import React from "react";
import styled from "styled-components";
import { Column } from "../../../kit/Grid";
import { StyledText } from "../../../kit/Topography";
import IconButtons from "../../../kit/IconButtons";
import { Link } from "../../../kit/Popup/components";
import Gap from "../../../kit/Gap";
import { WHITE } from "../../../styles/variables/colors";

const StyledContainer = styled(Column)`
  background: #7C4BB4;
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 10px;
  position: relative;
`;

interface DeletedRecordingNotificationProps {
  onClose: () => any;
  onRestore: () => any;
  visible?: boolean;
}

export const DeletedRecordingNotification = ({onClose, onRestore, visible}: DeletedRecordingNotificationProps) => {
  return <StyledContainer visible={visible} centered>
    <IconButtons.CloseTooltip onClick={onClose}/>
    <StyledText small color={WHITE}>
      {/* TODO: move it to I18n */}
      You have deleted your recording.
    </StyledText>
    <Gap height={8}/>
    <Link onClick={onRestore}>
      Undo
    </Link>
  </StyledContainer>
}
