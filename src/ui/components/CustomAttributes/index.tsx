import React from "react";
import styles from "./styles.module.css";
import Checkbox from "../Inputs/Checkbox";
import InputLine from "../Inputs/InputLine";
import CustomAttribute, {
  AttributePresentation,
} from "../../../types/resources/custom-attribute";

interface Props {
  attributes: CustomAttribute[];
  disabled: boolean;
}

const CustomAttributes = (props: Props) => (
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
          <InputLine
            key={attribute.id}
            label={attribute.label}
            value={attribute.value as string}
            id={attribute.id}
            disabled={props.disabled}
          />
        );
      }
    })}
  </div>
);

export default CustomAttributes;
