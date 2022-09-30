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
import {
  Errors,
  mapCustomAttributesErrors,
} from "../../../core/mappers/custom-attributes/save-values-errors.map";
import userAgentManager from "../../../core/userAgentManager";

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
  onCustomAttributesSave,
  onCustomAttributesSaved,
  onBack,
  onRecorderClose,
}: Props): JSX.Element => {
  const controller = useContext(ControllerContext);
  const { isDeprecated: isOld } = userAgentManager;

  const [dataArray, setDataArray] = useState<CustomAttributeObject[]>([]);
  const customAttributes = controller.customAttributes;
  const [state, setState] = useState<State>(STATES.INITIAL);
  const [errors, setErrors] = useState<Errors>();

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

    if (result.hasErrors) {
      const mappedErrors = mapCustomAttributesErrors({
        errors: result.errors,
        config: customAttributes,
      });

      setErrors(mappedErrors);
      setState(STATES.FAILED);
    } else {
      setTimeout(() => setState(STATES.SAVED), ONE_SECOND);

      if (onCustomAttributesSaved)
        setTimeout(onCustomAttributesSaved, ONE_SECOND);
    }
  };

  useEffect(() => {
    const attributesArray =
      Array.isArray(attributes) && attributes.length > 0
        ? attributes
        : customAttributes;

    setDataArray(attributesArray as CustomAttributeObject[]);
  }, []);

  return (
    <>
      {(state === STATES.INITIAL || state === STATES.FAILED) && (
        <div
          className={cx(
            "attributes__container__wrapper",
            { active: !disabled && !isOld },
            { bordered: !noBorder }
          )}
        >
          {state === STATES.FAILED && errors && errors._defaultMapperError && (
            <p className={styles.main__error__label}>
              {errors._defaultMapperError}
            </p>
          )}
          <div
            className={cx(
              "attributes__wrapper",
              { active: !disabled },
              { narrow: !!onRecorderClose }
            )}
          >
            <div
              className={cx(
                "scroll",
                { disabled },
                { high: !(disabled || !!onRecorderClose) }
              )}
            >
              {dataArray.map((attribute, index) => {
                return (
                  <React.Fragment key={attribute.id + index}>
                    {!disabled && (
                      <CustomInput
                        type={attribute.presentation}
                        label={attribute.label}
                        metadata={attribute.metadata}
                        value={attribute.value as string}
                        id={attribute.id}
                        values={attribute?.values}
                        onUpdate={onUpdate}
                      />
                    )}

                    {disabled && ( attribute.presentation !== AttributePresentation.Checkbox
                      ? <DisabledInput
                        id={attribute.id}
                        label={attribute.label}
                        value={attribute.value as string}
                      />
                      : <Checkbox 
                          id={attribute.id}
                          label={attribute.label}
                          value={attribute.value as string}
                          disabled
                          onUpdate={onUpdate}/>
                    )}

                    {state === STATES.FAILED && errors[attribute.id] && (
                      <p className={styles.attribute__error}>
                        {errors[attribute.id]}
                      </p>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
          {!disabled && (
            <div className={styles.attributes__actions}>
              {onRecorderClose && <Close onClick={onRecorderClose} />}
              {onBack && <button onClick={onBack}>BACK</button>}
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
    </>
  );
};

export default memo(CustomAttributes);
