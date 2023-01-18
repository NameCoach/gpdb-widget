import React, { Fragment, memo, useMemo } from "react";
import {
  AttributePresentation,
  CustomAttributeObject,
  CustomAttributeValue,
} from "../../../../types/resources/custom-attribute";
import classNames from "classnames";
import styles from "./styles.module.css";
import Inspector from "./inspector";
import BooleanInspector from "./boolean_inspector";
import MultipleBooleanInspector from "./multiple_boolean_inspector";
import useFeaturesManager, {
  CanComponents,
} from "../../../hooks/useFeaturesManager";
import Pronunciation from "../../../../types/resources/pronunciation";
import Gap from "../../../kit/Gap";

const cx = classNames.bind(styles);

interface Props {
  data: CustomAttributeObject[];
  pronunciation?: Pronunciation;
}
const ATTRIBUTE_PRESENTATIONS = {
  [AttributePresentation.Checkbox]: BooleanInspector,
  [AttributePresentation.MultipleCheckbox]: MultipleBooleanInspector,
};

const CustomAttributesInspector = ({
  data,
  pronunciation,
}: Props): JSX.Element => {
  const { can } = useFeaturesManager();
  // #TODO: rework custom attributes feature in manager, cause it mixes data and policies
  const canEditCustomAttributes = can(
    CanComponents.EditCustomAttributesForSelf,
    pronunciation
  );

  const valuePresent = (value: CustomAttributeValue): boolean => {
    if (typeof value === "object" && Object.keys(value).length > 0) return true;
    if (typeof value === "string" && value.length > 0) return true;
    if (typeof value === "boolean" && value === true) return true;

    return false;
  };

  const dataLastElementIndex = useMemo(() => data?.length - 1, [data]);

  return (
    <>
      {canEditCustomAttributes && (
        <div className={cx(styles.column)}>
          {data.map(({ presentation, value, label }, index) => {
            const Component =
              ATTRIBUTE_PRESENTATIONS[presentation] ?? Inspector;

            return valuePresent(value) ? (
              <Fragment key={index}>
                <Component key={index} value={value} label={label} />

                {index !== dataLastElementIndex && <Gap height={12} />}
              </Fragment>
            ) : null;
          })}
        </div>
      )}
    </>
  );
};

export default memo(CustomAttributesInspector);
