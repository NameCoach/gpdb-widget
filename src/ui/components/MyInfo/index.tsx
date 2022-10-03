import React, { useContext, useEffect, useRef, useState } from "react";
import IFrontController from "../../../types/front-controller";
import { NameOption } from "../FullNamesList";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import Loader from "../Loader";
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
  const [data, setData] = useState<CustomAttributeObject[]>(cloneDeep(pronunciation?.customAttributes) || []);
  const config = cloneDeep(controller.customAttributes);
  const styleContext = useContext<IStyleContext>(StyleContext);
  const customFeatures = useCustomFeatures(controller, styleContext);
  const { t } = useTranslator(controller, styleContext);
  const { can } = useFeaturesManager(controller.permissions, customFeatures);
  const customAttrsPresent = data?.length > 0 && data.some(e => e.value && String(e.value).length !== 0);
  const customAttrsRef = useRef<Record<string, any>>({});
  const [requestErrors, setRequestErrors] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);

  // TODO: work around it
  const customAttributesDisabled = !can("editCustomAttributesForSelf");
  // TODO: 👆

  const resetAttributes = () => {
    console.log({pronunciation});
    console.log({controller});
  };
  
  useEffect(() => {
    setData(cloneDeep(pronunciation?.customAttributes) as CustomAttributeObject[]);
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
    };
    
    onCustomAttributesSaved();
    setLoading(false);
    setInEdit(false);
  };

  const closeEdit = () => {
    setInEdit(false);
    setRequestErrors([]);
    resetAttributes();
  }

  return (
    <div className={cx(styles.block, styles.column)}>
      <div className={cx(styles.row)}>
        <div>
          <span className={styles.title}>
            {t("my_info_section_name", "My Info")}
          </span>
        </div>

        <div className={styles.actions}>
          {(() => {
            if (loading) return (
              <Loader inline sm />
            );

            if (inEdit) return (
              <>
                <button
                  className={styles.icon_btn}
                  onClick={closeEdit}
                >
                  <i className={styles.close_icon} />
                </button>
                <button className={styles.icon_btn} onClick={saveMyInfo}>
                  <i className={styles.save_icon} />
                </button>
              </>
            );
            else return (
              <button
                className={styles.icon_btn}
                onClick={(): void => setInEdit(true)}
              >
                <i className={styles.edit_icon} />
              </button>
            );
          })()}
        </div>

        {/* <div className={cx(styles.actions)}>{loading && <Loader />}</div> */}
      </div>
      <div className={cx(styles.row)}>
        {(() =>{
          if (inEdit) return (
            <CustomAttributes
              disabled={!inEdit}
              errors={requestErrors}
              data={data.length > 0 ? data : config}
              ref={customAttrsRef}
            />
          ); else {
            if (customAttrsPresent) return (
              <CustomAttributesInspector data={data} />
            ); else return (
              <div className={styles.tip_container}>
                <p className={styles.tip_text}>
                  {t("my_info_empty_tip", 'Edit "My Info" to add new information')}
                </p>
              </div>
            );
          };
        })()}
      </div>
    </div>
  );
};

export default MyInfo;
