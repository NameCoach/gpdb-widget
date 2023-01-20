import React, { ReactNode, useEffect, useState } from "react";
import { ModalBackground } from "./ModalBackground";
import { ModalContainer } from "./ModalContainer";
import { CloseTooltipButton } from "../NewIconButtons";
import { Column } from "../Grid";

interface ModalProps {
  children: ReactNode;
  visible?: boolean;
  onClose?: () => void;
}

export const Modal = ({ children, visible = false, onClose }: ModalProps) => {
  const [_visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    setVisible(visible);
  }, [visible]);

  const _onClose = () => {
    setVisible(false);
    onClose();
  };

  return (
    <ModalBackground visible={visible} onClick={_onClose}>
      <Column centered>
        <ModalContainer>
          <CloseTooltipButton onClick={_onClose} />

          {children}
        </ModalContainer>
      </Column>
    </ModalBackground>
  );
};
