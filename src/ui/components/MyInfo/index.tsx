import React, { useContext, useMemo } from "react";
import IFrontController from "../../../types/front-controller";
import { NameOption } from "../FullNamesList";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import CustomAttributes from "../Outlook/CustomAttributes";
import StyleContext from "../../contexts/style";
import useFeaturesManager, {
  CanComponents,
} from "../../hooks/useFeaturesManager";
import useTranslator from "../../hooks/useTranslator";
import Pronunciation from "../../../types/resources/pronunciation";
import ControllerContext from "../../../../src/ui/contexts/controller";
import IStyleContext from "../../../types/style-context";
import CustomAttributesInspector from "../Outlook/CustomAttributesInspector";
import Actions from "./Actions";
import useCustomAttributes from "../../hooks/useCustomAttributes";
import Gap from "../../kit/Gap";
import { NameOwner } from "gpdb-api-client";

interface Props {
  name: string;
  owner: NameOwner;
  pronunciation: Pronunciation;
  onCustomAttributesSaved: () => void;
}

const cx = classNames.bind(styles);

const MyInfo = ({
  name,
  owner,
  pronunciation,
  onCustomAttributesSaved,
}: Props): JSX.Element => {
  if (!name?.trim()) throw new Error("Name shouldn't be blank");

  const controller = useContext<IFrontController>(ControllerContext);
  const styleContext = useContext<IStyleContext>(StyleContext);
  const { t } = useTranslator(controller, styleContext);
  const { can } = useFeaturesManager();

  // TODO: Has to be revised after https://name-coach.atlassian.net/browse/INT-241
  const canEditCustomAttributes = useMemo(() => {
    return can(CanComponents.EditCustomAttributesForSelf, pronunciation);
  }, [controller.permissions, pronunciation]);

  const {
    loading,
    errors,
    data,
    saveCustomAttributes,
    exitEditMode,
    enterEditMode,
    inEdit,
    config,
    customAttrsPresent,
    customAttrsRef,
    makeChanges,
    isUnsavedChanges,
  } = useCustomAttributes({
    controller,
    pronunciation,
    owner,
    saveCallback: onCustomAttributesSaved,
  });

  return (
    <>
      {canEditCustomAttributes && (
        <div className={cx(styles.block, styles.column)}>
          <div className={cx(styles.row, styles.height_22)}>
            <div>
              <span className={styles.title}>
                {t("my_info_section_custom_attributes")}
              </span>
            </div>

            <Actions
              loading={loading}
              inEdit={inEdit}
              closeEdit={exitEditMode}
              saveMyInfo={saveCustomAttributes}
              openEdit={enterEditMode}
              canEditCustomAttributes={canEditCustomAttributes}
              isUnsavedChanges={isUnsavedChanges}
            />
          </div>

          <Gap height={20} />

          <div className={cx(styles.row)}>
            {((): JSX.Element => {
              if (inEdit)
                return (
                  <CustomAttributes
                    disabled={!inEdit}
                    errors={errors}
                    data={data?.length > 0 ? data : config}
                    ref={customAttrsRef}
                    makeChanges={makeChanges}
                  />
                );
              else {
                if (customAttrsPresent)
                  return (
                    <CustomAttributesInspector
                      data={data}
                      pronunciation={pronunciation}
                    />
                  );
                else
                  return (
                    <div className={styles.tip_container}>
                      <p className={styles.tip_text}>
                        {t("my_info_empty_tip")}
                      </p>
                    </div>
                  );
              }
            })()}
          </div>
        </div>
      )}
    </>
  );
};

export default MyInfo;
