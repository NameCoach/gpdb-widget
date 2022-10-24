import React, { useContext, useEffect, useRef, useState } from "react";
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
import { CustomAttributeObject } from "../../../core/mappers/custom-attributes.map";
import { cloneDeep } from "lodash";
import Actions from "./Actions";

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

  const [inEdit, setInEdit] = useState<boolean>(false);
  const controller = useContext<IFrontController>(ControllerContext);
  const [data, setData] = useState<CustomAttributeObject[]>(
    cloneDeep(pronunciation?.customAttributes) || []
  );
  const config = cloneDeep(controller.customAttributes);
  const styleContext = useContext<IStyleContext>(StyleContext);
  const customFeatures = useCustomFeatures(controller, styleContext);
  const { t } = useTranslator(controller, styleContext);
  const { can } = useFeaturesManager(controller.permissions, customFeatures);
  const customAttrsPresent =
    data?.length > 0 &&
    data.some((e) => e.value && String(e.value).length !== 0);
  const customAttrsRef = useRef<Record<string, any>>({});
  const [requestErrors, setRequestErrors] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Probably, won't need this after https://name-coach.atlassian.net/browse/INT-241
  const customAttributesDisabled = !can(
    "editCustomAttributesForSelf",
    pronunciation
  );

  const resetAttributes = (): void => {
    console.log({ pronunciation });
    console.log({ controller });
  };

  useEffect(() => {
    setData(
      cloneDeep(pronunciation?.customAttributes) as CustomAttributeObject[]
    );
  }, [pronunciation]);

  const saveMyInfo = async (): Promise<void> => {
    const data = customAttrsRef.current.data;
    setLoading(true);

    const values = data.reduce((prev, current) => {
      prev[current.id] = current.value;
      return prev;
    }, {});

    const res = await controller.saveCustomAttributes(values, name.owner);

    if (res.hasErrors) {
      setRequestErrors(res.errors.custom_attributes_values);
      setLoading(false);
      return;
    }

    onCustomAttributesSaved();
    setRequestErrors([]);
    setLoading(false);
    setInEdit(false);
  };

  const closeEdit = (): void => {
    setInEdit(false);
    setRequestErrors([]);
    resetAttributes();
  };

  const openEdit = (): void => setInEdit(true);

  return (
    <div className={cx(styles.block, styles.column)}>
      <div className={cx(styles.row)}>
        <div>
          <span className={styles.title}>
            {t("my_info_section_custom_attributes", "My Info")}
          </span>
        </div>

        <Actions
          loading={loading}
          inEdit={inEdit}
          closeEdit={closeEdit}
          saveMyInfo={saveMyInfo}
          openEdit={openEdit}
          customAttributesDisabled={customAttributesDisabled}
        />

        {/* <div className={cx(styles.actions)}>{loading && <Loader />}</div> */}
      </div>
      <div className={cx(styles.row)}>
        {((): JSX.Element => {
          if (inEdit)
            return (
              <CustomAttributes
                disabled={!inEdit}
                errors={requestErrors}
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
                  <p className={styles.tip_text}>
                    {t(
                      "my_info_empty_tip",
                      'Edit "My Info" to add new information'
                    )}
                  </p>
                </div>
              );
          }
        })()}
      </div>
    </div>
  );
};

export default MyInfo;
