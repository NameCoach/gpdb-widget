import React from "react";
import useTranslator from "../../../hooks/useTranslator";
import ActionsPanel from "../../../kit/ActionsPanel";
import IconButtons from "../../../kit/IconButtons";
import Tooltip from "../../../kit/Tooltip";
import useTooltip from "../../../kit/Tooltip/hooks/useTooltip";
import Loader from "../../Loader";

const TOOLTIP_SIDE_OFFSET = 0;

interface Props {
  loading: boolean;
  inEdit: boolean;
  closeEdit: () => void;
  saveMyInfo: () => void;
  openEdit: () => void;
  canEditCustomAttributes: boolean;
  isUnsavedChanges: boolean;
}
const Actions = ({
  loading,
  inEdit,
  closeEdit,
  saveMyInfo,
  openEdit,
  canEditCustomAttributes,
  isUnsavedChanges,
}: Props): JSX.Element => {
  const { t } = useTranslator();
  const closeTip = useTooltip<HTMLButtonElement>();
  const saveTip = useTooltip<HTMLButtonElement>();
  const editTip = useTooltip<HTMLButtonElement>();

  const closeEditHandle = () => {
    closeEdit();
    closeTip.tooltip.hide();
  };

  const saveMyInfoHandle = () => {
    saveMyInfo();
    saveTip.tooltip.hide();
  };

  const openEditHandle = () => {
    openEdit();
    editTip.tooltip.hide();
  };

  return (
    <ActionsPanel>
      {(() => {
        if (loading) return <Loader inline sm />;

        if (inEdit)
          return (
            <>
              <div>
                <Tooltip
                  opener={closeTip.opener}
                  ref={closeTip.tooltipRef}
                  rightArrow
                >
                  {t("my_info_discard_changes")}
                </Tooltip>
                <IconButtons.Close
                  onClick={closeEditHandle}
                  ref={closeTip.openerRef}
                />
              </div>
              <div>
                <Tooltip
                  opener={saveTip.opener}
                  ref={saveTip.tooltipRef}
                  rightArrow
                  arrowSideOffset={TOOLTIP_SIDE_OFFSET}
                >
                  {t("my_info_save_changes")}
                </Tooltip>
                {isUnsavedChanges ? (
                  <IconButtons.SaveWithChanges
                    onClick={saveMyInfoHandle}
                    ref={saveTip.openerRef}
                  />
                ) : (
                  <IconButtons.Save
                    ref={saveTip.openerRef}
                    disabled
                  />
                )}
              </div>
            </>
          );
        else if (canEditCustomAttributes)
          return (
            <div>
              <Tooltip
                opener={editTip.opener}
                ref={editTip.tooltipRef}
                rightArrow
                arrowSideOffset={TOOLTIP_SIDE_OFFSET}
              >
                {t("my_info_edit")}
              </Tooltip>
              <IconButtons.Edit
                onClick={openEditHandle}
                ref={editTip.openerRef}
              />
            </div>
          );
      })()}
    </ActionsPanel>
  );
};

export default Actions;
