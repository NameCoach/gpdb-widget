import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import classNames from "classnames/bind";

import styles from "./styles.module.css";
import Checkbox from "../Inputs/Checkbox";
import DisabledInput from "../Inputs/DisabledInput";
import CustomAttribute, {
  AttributePresentation,
} from "../../../types/resources/custom-attribute";
import CustomInput from "../Inputs/CustomInput";
import ControllerContext from "../../contexts/controller";
import Close from "../Close";
import { CustomAttributeObject } from "../../../core/mappers/custom-attributes.map";
import Loader from "../Loader";
import { NameOwner } from "gpdb-api-client";

const ONE_SECOND = 1000;

type State = "initial" | "saving" | "saved" | "failed";

enum STATES {
  INITIAL = "initial",
  SAVING = "saving",
  SAVED = "saved",
  FAILED = "failed",
}

interface Props {
  disabled: boolean;
  owner?: NameOwner;
  saving?: boolean;
  attributes?: CustomAttribute[];
  noBorder?: boolean;
  high?: boolean;
  onCustomAttributesSave?: () => void;
  onCustomAttributesSaved?: () => void;
  onBack?: () => void;
  onRecorderClose?: () => void;
}

const cx = classNames.bind(styles);

const CustomAttributes = ({
  disabled,
  attributes,
  owner,
  noBorder,
  high,
  onCustomAttributesSave,
  onCustomAttributesSaved,
  onBack,
  onRecorderClose,
}: Props): JSX.Element => {
  const controller = useContext(ControllerContext);

  const [dataArray, setDataArray] = useState<CustomAttributeObject[]>([]);
  const customAttributes = controller.customAttributes;
  const [state, setState] = useState<State>(STATES.INITIAL);

  const onUpdate = useCallback(({ id, value }): void => {
    setDataArray((dataArray) =>
      dataArray.map((d) => (d.id === id ? { ...d, value } : d))
    );
  }, []);

  const onSave = async (): Promise<void> => {
    setState(STATES.SAVING);
    if (onCustomAttributesSave) onCustomAttributesSave();

    const customValues = dataArray.reduce(
      (acc, d) => ({ ...acc, [d.id]: d.value }),
      {}
    );

    const result = await controller.saveCustomAttributes(customValues, owner);

    if (result) {
      setTimeout(() => setState(STATES.SAVED), ONE_SECOND);

      if (onCustomAttributesSaved)
        setTimeout(onCustomAttributesSaved, ONE_SECOND);
    } else {
      setState(STATES.FAILED);
    }
  };

  const backToInitial = (): void => setState(STATES.INITIAL);

  useEffect(() => {
    const attributesArray = attributes || customAttributes;

    setDataArray(attributesArray as CustomAttributeObject[]);
  }, []);

  return (
    <>
      {state === STATES.INITIAL && (
        <div
          className={cx(
            "attributes__container__wrapper",
            { active: !disabled },
            { bordered: !noBorder }
          )}
        >
          <div className={cx("attributes__wrapper", { active: !disabled })}>
            <div
              className={cx(
                "scroll",
                { disabled },
                { high: !disabled && high }
              )}
            >
              {dataArray.map((attribute, index) => {
                return (
                  <React.Fragment key={attribute.id + index}>
                    {attribute.presentation ===
                    AttributePresentation.Checkbox ? (
                      <Checkbox
                        label={attribute.label}
                        value={attribute.value as boolean}
                        id={attribute.id}
                        disabled={disabled}
                        onUpdate={onUpdate}
                      />
                    ) : (
                      <>
                        {!disabled && (
                          <CustomInput
                            type={attribute.presentation}
                            label={attribute.label}
                            value={attribute.value as string}
                            id={attribute.id}
                            values={attribute?.values}
                            onUpdate={onUpdate}
                          />
                        )}
                        {disabled && (
                          <DisabledInput
                            id={attribute.id}
                            label={attribute.label}
                            value={attribute.value as string}
                          />
                        )}
                      </>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
          {!disabled && (
            <div className={styles.attributes__actions}>
              {onRecorderClose && <Close onClick={onRecorderClose} />}
              {onBack && (
                <button className={styles.back__button} onClick={onBack}>
                  BACK
                </button>
              )}
              <button onClick={onSave}>SAVE DATA</button>
            </div>
          )}
        </div>
      )}
      {state === STATES.SAVING && (
        <div className={styles.modal__wrapper}>
          Saving your data..
          <Loader inline />
        </div>
      )}
      {state === STATES.SAVED && (
        <div className={styles.modal__wrapper}>Data saved!</div>
      )}
      {state === STATES.FAILED && (
        <div className={styles.modal__wrapper}>
          <div className={styles.error}>
            Error! Please fill in all the required fields.
          </div>
          <button onClick={backToInitial}>OK</button>
        </div>
      )}
    </>
  );
};

export default memo(CustomAttributes);
