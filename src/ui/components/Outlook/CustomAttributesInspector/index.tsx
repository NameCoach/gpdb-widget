import React, { memo } from "react";
import { CustomAttributeObject } from "../../../../core/mappers/custom-attributes.map";
import { AttributePresentation } from "../../../../types/resources/custom-attribute";
import classNames from "classnames";
import styles from "./styles.module.css";
import Inspector from "./inspector";
import BooleanInspector from "./boolean_inspector";

const cx = classNames.bind(styles);

interface Props {
  data: CustomAttributeObject[];
}

const CustomAttributesInspector = ({ data }: Props) => {
  return (
    <div className={cx(styles.column)}>
      {data.map(({ presentation, value, label }, index) => {
        let Component = Inspector;

        if (presentation === AttributePresentation.Checkbox)
          Component = BooleanInspector;

        return <Component key={index} value={value} label={label} />;
      })}
    </div>
  );
};

export default memo(CustomAttributesInspector);
