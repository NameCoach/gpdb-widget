import React, { memo, useEffect, useImperativeHandle, useState } from "react";
import classNames from "classnames/bind";

import styles from "./styles.module.css";
import Checkbox from "../Inputs/Checkbox";
import {
  AttributePresentation,
  CustomAttributeObject,
} from "../../../../types/resources/custom-attribute";
import Textarea from "../Inputs/Textarea";
import Select from "../Inputs/Select";
import Textbox from "../Inputs/Textbox";
import { CustomAttributesProps } from "../Inputs/types";
import Errors from "../Errors";
import { cloneDeep } from "lodash";
import MultipleCheckbox from "../Inputs/MultipleCheckbox";
import Radio from "../Inputs/Radio";
import { useDebouncedCallback } from "use-debounce";
import Analytics from "../../../../analytics";

const cx = classNames.bind(styles);

const errorArrayToObject = (errorsArray: any[]): { [x: string]: any } => {
  const errorsObject = cloneDeep(errorsArray?.[0] || {});

  Object.keys(errorsObject).forEach((key) => {
    errorsObject[key] = errorsObject[key]?.reduce((acc, item) => {
      return [...acc, ...item?.value];
    }, []);
  });

  return errorsObject;
};

const CustomAttributes = (
  { disabled, errors: propsErrors, data, makeChanges }: CustomAttributesProps,
  ref
): JSX.Element => {
  const [errors, setErrors] = useState(errorArrayToObject(propsErrors));

  // Allow parent component to receive custom attributes data from above
  const [_data, setData] = useState<CustomAttributeObject[]>(cloneDeep(data));
  useImperativeHandle(ref, () => ({ data: _data }), [_data]);

  const setAttributeValue = (id: string, value: string | boolean): void => {
    const newData = [..._data];
    newData.find((attr) => attr.id === id).value = value;
    setData(newData);
    makeChanges(JSON.stringify(data) !== JSON.stringify(newData));
  };

  const ComponentPresentationMapper = {
    [AttributePresentation.Checkbox]: Checkbox,
    [AttributePresentation.Dropdown]: Select,
    [AttributePresentation.Textbox]: Textbox,
    [AttributePresentation.Textarea]: Textarea,
    [AttributePresentation.MultipleCheckbox]: MultipleCheckbox,
    [AttributePresentation.Radio]: Radio,
  };

  const { sendAnalyticsEvent } = Analytics.useAnalytics();

  const sendAnalyticsChangeFieldEvent = useDebouncedCallback(
    (id, value) =>
      sendAnalyticsEvent(Analytics.AnalyticsEventTypes.MyInfo.ChangeField, {
        options: {
          key: id,
          val: value,
          prevVal: data?.find((i) => i.id === id)?.value,
        },
      }),
    3000
  );

  const onInputChange = (id, value) => {
    sendAnalyticsChangeFieldEvent.cancel();
    sendAnalyticsChangeFieldEvent(id, value);

    setAttributeValue(id, value);

    const { [id]: _errorId, ...restErrors } = errors;

    setErrors(restErrors);
  };

  useEffect(() => {
    if (propsErrors.length > 0) {
      const errs = errorArrayToObject(propsErrors);
      setErrors(errs);
    }
  }, [propsErrors]);

  return (
    <div className={cx(styles.column)}>
      {_data.map(
        ({ presentation, id, value, values, label, metadata }, index) => {
          const Component = ComponentPresentationMapper[presentation];
          const errorMessages = errors[id] || [];

          return (
            <React.Fragment key={index}>
              <Component
                id={id}
                value={value}
                label={label}
                disabled={disabled}
                values={values}
                metadata={metadata}
                hasErrors={errorMessages.length > 0}
                onChange={onInputChange}
              />

              {presentation !== AttributePresentation.Checkbox && (
                <Errors id={id} messages={errorMessages} />
              )}
            </React.Fragment>
          );
        }
      )}
    </div>
  );
};

export default memo(React.forwardRef(CustomAttributes));
