import React from "react";
import ActionsPanel from "../../../kit/ActionsPanel";
import IconButtons from "../../../kit/IconButtons";
import Loader from "../../Loader";

interface Props {
  loading: boolean;
  inEdit: boolean;
  closeEdit: () => void;
  saveMyInfo: () => void;
  openEdit: () => void;
  customAttributesDisabled: boolean;
}
const Actions = ({
  loading,
  inEdit,
  closeEdit,
  saveMyInfo,
  openEdit,
  customAttributesDisabled,
}: Props): JSX.Element => {
  return (
    <ActionsPanel>
      {(() => {
        if (loading) return <Loader inline sm />;

        if (inEdit)
          return (
            <>
              <IconButtons.Close onClick={closeEdit} />
              <IconButtons.Save onClick={saveMyInfo} />
            </>
          );
        else
          return (
            !customAttributesDisabled && <IconButtons.Edit onClick={openEdit} />
          );
      })()}
    </ActionsPanel>
  );
};

export default Actions;
