import React from "react";
import { Row } from "../../../kit/Grid";
import { Speaker } from "../../shared/components";
import IconButtons from "../../../kit/IconButtons";
import { CloseButton, SaveButton } from "../../../kit/NewIconButtons";
import Pronunciation from "../../../../types/resources/pronunciation";

interface ActionProps {
  inEdit: boolean;
  pronunciation: Pronunciation;
  firstNamePronun: Pronunciation;
  lastNamePronun: Pronunciation;
  touched: boolean;
  onEdit: () => void;
  onSave: () => void;
  onClose: () => void;
}

export const Actions = ({
  inEdit,
  pronunciation,
  firstNamePronun,
  lastNamePronun,
  touched,
  onEdit,
  onSave,
  onClose,
}: ActionProps) => {
  return (
    <>
      {!inEdit && (
        <Row gap={8} right autoWidth flex={"0 0 auto"}>
          {!firstNamePronun && !lastNamePronun && (
            <Speaker pronunciation={pronunciation} />
          )}
          <IconButtons.Edit onClick={onEdit} />
        </Row>
      )}

      {inEdit && (
        <Row gap={8} right autoWidth flex={"0 0 auto"}>
          <SaveButton active={touched} onClick={onSave} />
          <CloseButton onClick={onClose} />
        </Row>
      )}
    </>
  );
};
