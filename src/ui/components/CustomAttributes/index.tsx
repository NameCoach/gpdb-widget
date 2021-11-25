import React from "react";
import styles from "./styles.module.css";
import Checkbox from "../Inputs/Checkbox";
import DisabledInput from "../Inputs/DisabledInput";
import CustomAttribute, {
  AttributePresentation,
} from "../../../types/resources/custom-attribute";
import Textarea from "../Inputs/Textarea";

interface Props {
  attributes: CustomAttribute[];
  disabled: boolean;
}

const CustomAttributes = (props: Props) => (
  <div className={styles.attributes_wrapper}>
    <div className={styles.scrollable}>
      {props.attributes.map((attribute) => {
        if (attribute.presentation === AttributePresentation.Checkbox) {
          return (
            <Checkbox
              key={attribute.id}
              label={attribute.label}
              value={attribute.value as boolean}
              id={attribute.id}
              disabled={props.disabled}
            />
          );
        } else {
          return (
            <>
              {!props.disabled && (
                <Textarea
                  key={attribute.id}
                  label={attribute.label}
                  value={attribute.value as string}
                  id={attribute.id}
                />
              )}
              {props.disabled && (
                <DisabledInput
                  key={attribute.id}
                  label={attribute.label}
                  value={attribute.value as string}
                  id={attribute.id}
                />
              )}
            </>
          );
        }
      })}
    </div>
  </div>
);

export default CustomAttributes;
