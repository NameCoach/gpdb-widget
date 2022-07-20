import React, { useContext, useState } from "react";
import IFrontController from "../../../types/front-controller";
import { NameOption } from "../FullNamesList";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import Loader from "../Loader";
import CustomAttributes from "../CustomAttributes";
import CollapsableAction from "../Actions/Collapsable";
import StyleContext from "../../contexts/style";
import useFeaturesManager from "../../hooks/useFeaturesManager";
import useCustomFeatures from "../../hooks/useCustomFeatures";
import useTranslator from "../../hooks/useTranslator";
import Pronunciation from "../../../types/resources/pronunciation";

interface Props {
  name: Omit<NameOption, "key">;
  controller: IFrontController;
  pronunciation: Pronunciation;
  onCustomAttributesSaved: () => void;
  loading: boolean;
}

const cx = classNames.bind(styles);

const MyInfo = (props: Props): JSX.Element => {
  if (!props?.name?.value?.trim()) throw new Error("Name shouldn't be blank");

  const styleContext = useContext(StyleContext);

  const customFeatures = useCustomFeatures(props.controller, styleContext);
  const t = useTranslator(props.controller, styleContext);

  const { can } = useFeaturesManager(
    props.controller.permissions,
    customFeatures
  );

  const [collapsableActive, setCollapsable] = useState(false);

  const customAttributesDisabled = !can("editCustomAttributesForSelf");

  const onCollapsable = (): void => {
    setCollapsable((value) => !value);
  };

  return (
    <>
      <div>
        <div className={cx(styles.row)}>
          <span className={cx(styles.title, styles.m_10)}>
            {t("my_info_section_name", "My Info")}
          </span>

          <div className={cx(styles.actions)}>
            {props.loading && <Loader />}

            {!props.loading && (
              <CollapsableAction
                active={collapsableActive}
                onClick={onCollapsable}
              />
            )}
          </div>
        </div>
      </div>

      {!props.loading && collapsableActive && (
        <CustomAttributes
          attributes={props.pronunciation?.customAttributes}
          owner={props.name.owner}
          disabled={customAttributesDisabled}
          onCustomAttributesSaved={props.onCustomAttributesSaved}
          onBack={onCollapsable}
          noBorder
        />
      )}
    </>
  );
};

export default MyInfo;
