import React, { useContext } from "react";
import IFrontController from "../../../types/front-controller";
import { NameOption } from "../FullNamesList";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import CustomAttributes from "../Outlook/CustomAttributes";
import StyleContext from "../../contexts/style";
import useFeaturesManager from "../../hooks/useFeaturesManager";
import useCustomFeatures from "../../hooks/useCustomFeatures";
import useTranslator from "../../hooks/useTranslator";
import Pronunciation from "../../../types/resources/pronunciation";
import ControllerContext from "../../../../src/ui/contexts/controller";
import IStyleContext from "../../../types/style-context";
import CustomAttributesInspector from "../Outlook/CustomAttributesInspector";
import Actions from "./Actions";
import useCustomAttributes from "../../hooks/useCustomAttributes";

interface Props {
  name: Omit<NameOption, "key">;
  pronunciation: Pronunciation;
  onCustomAttributesSaved: () => void;
  loading: boolean;
}

const cx = classNames.bind(styles);

const MyInfo = ({
  name,
  pronunciation,
  onCustomAttributesSaved,
}: Props): JSX.Element => {
  if (!name?.value?.trim()) throw new Error("Name shouldn't be blank");

  const controller = useContext<IFrontController>(ControllerContext);

  const styleContext = useContext<IStyleContext>(StyleContext);
  const customFeatures = useCustomFeatures(controller, styleContext);
  const { t } = useTranslator(controller, styleContext);
  const { can } = useFeaturesManager(controller.permissions, customFeatures);

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
  } = useCustomAttributes({
    controller,
    pronunciation,
    name,
    saveCallback: onCustomAttributesSaved,
  });

  // Probably, won't need this after https://name-coach.atlassian.net/browse/INT-241
  const customAttributesDisabled = !can(
    "editCustomAttributesForSelf",
    pronunciation
  );

  return (
    <div className={cx(styles.block, styles.column)}>
      <div className={cx(styles.row)}>
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
          customAttributesDisabled={customAttributesDisabled}
        />
      </div>

      <div className={cx(styles.row)}>
        {((): JSX.Element => {
          if (inEdit)
            return (
              <CustomAttributes
                disabled={!inEdit}
                errors={errors}
                data={data?.length > 0 ? data : config}
                ref={customAttrsRef}
              />
            );
          else {
            if (customAttrsPresent)
              return <CustomAttributesInspector data={data} />;
            else
              return (
                <div className={styles.tip_container}>
                  <p className={styles.tip_text}>{t("my_info_empty_tip")}</p>
                </div>
              );
          }
        })()}
      </div>
    </div>
  );
};

export default MyInfo;
