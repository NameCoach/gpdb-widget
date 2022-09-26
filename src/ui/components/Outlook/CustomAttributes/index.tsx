import React, {
  memo,
  useContext,
  useImperativeHandle,
} from "react";
import classNames from "classnames/bind";

import styles from "./styles.module.css";
import Checkbox from "../Inputs/Checkbox";
import { AttributePresentation } from "../../../../types/resources/custom-attribute";
import Textarea from "../Inputs/Textarea";
import Select from "../Inputs/Select";
import Textbox from "../Inputs/Textbox";
import { CustomAttributesProps } from "../Inputs/types";
import Errors from "../Errors";

const cx = classNames.bind(styles);

const CustomAttributes = (
  { disabled, errors, data, setData }: CustomAttributesProps,
  ref
): JSX.Element => {
  // Allow parent component to receive custom attributes data from above
  useImperativeHandle(ref, () => ({ data }), [data]);

  const setAttributeValue = (id: string, value: string | boolean): void => {
    const newData = [...data];
    newData.find((attr) => attr.id === id).value = value;
    setData(newData);
  };

  const onCheckBoxUpdate = (id) => (value) => {
    setAttributeValue(id, value);
  };
  const onSelectUpdate = (id) => (option) => {
    setAttributeValue(id, option.value);
  };
  const onTextareaUpdate = (id) => (value) => {
    setAttributeValue(id, value);
  };
  const onTextboxUpdate = onTextareaUpdate;

  const HandlerPresentationMapper = {
    [AttributePresentation.Checkbox]: onCheckBoxUpdate,
    [AttributePresentation.Dropdown]: onSelectUpdate,
    [AttributePresentation.Textbox]: onTextboxUpdate,
    [AttributePresentation.Textarea]: onTextareaUpdate,
  };

  const ComponentPresentationMapper = {
    [AttributePresentation.Checkbox]: Checkbox,
    [AttributePresentation.Dropdown]: Select,
    [AttributePresentation.Textbox]: Textbox,
    [AttributePresentation.Textarea]: Textarea,
  };

  return (
    <div>
      {data.map(
        ({ presentation, id, value, values, label, metadata }, index) => {
          const Component = ComponentPresentationMapper[presentation];
          const updateHandler = HandlerPresentationMapper[presentation](id);
          const attributeErrors = errors.find(e => Object.keys(e).includes(id))?.[id]?.find(e => Object.keys(e).includes('value'))?.value;
          
          return (
            <React.Fragment key={index}>
              <Errors id={`custom_attr_error_${id}`} messages={attributeErrors}/>
              <Component
                id={`custom_attr_${id}`}
                value={value}
                label={label}
                disabled={disabled}
                values={values}
                metadata={metadata}
                onUpdate={updateHandler}
                hasErrors={attributeErrors?.length > 0}
              />
            </React.Fragment>
          );
        }
      )}
    </div>
  );
};

export default memo(React.forwardRef(CustomAttributes));
