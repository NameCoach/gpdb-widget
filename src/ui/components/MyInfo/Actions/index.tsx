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
  canEditCustomAttributes: boolean;
}
const Actions = ({
  loading,
  inEdit,
  closeEdit,
  saveMyInfo,
  openEdit,
  canEditCustomAttributes,
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
        else if (canEditCustomAttributes)
          return <IconButtons.Edit onClick={openEdit} />;
      })()}
    </ActionsPanel>
  );
};

export default Actions;
