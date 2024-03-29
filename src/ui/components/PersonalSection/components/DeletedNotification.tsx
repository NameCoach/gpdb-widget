import React, { useLayoutEffect, useRef } from "react";
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

interface DeletedNotificationProps {
  onClose: () => any;
  onRestore: () => any;
  message: string;
}

const AUTOCLOSE_DELAY = 5000;

export const DeletedNotification = ({onClose, onRestore, message}: DeletedNotificationProps) => {
  const timeout = useRef<ReturnType<typeof setTimeout>>(null);
  
  useLayoutEffect(() => {
    timeout.current = setTimeout(onClose, AUTOCLOSE_DELAY);

    return () => {
      clearTimeout(timeout.current);
    };
  }, [onClose]);
  
  return <StyledContainer centered>
    <IconButtons.CloseTooltip onClick={onClose}/>
    <StyledText small color={WHITE}>
      {message}
    </StyledText>
    <Gap height={8}/>
    <Link onClick={onRestore}>
      Undo
    </Link>
  </StyledContainer>
}
