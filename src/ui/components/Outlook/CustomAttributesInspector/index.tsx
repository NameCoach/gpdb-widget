import React, { memo } from "react";
import { CustomAttributeObject } from "../../../../core/mappers/custom-attributes.map";
import { AttributePresentation } from "../../../../types/resources/custom-attribute";
import classNames from "classnames";
import styles from "./styles.module.css";
import Inspector from "./inspector";
import BooleanInspector from "./boolean_inspector";
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

const CustomAttributesInspector = ({ data, pronunciation }: Props) => {
  const { can } = useFeaturesManager();
  // #TODO: rework custom attributes feature in manager, cause it mixes data and policies
  const canEditCustomAttributes = can(
    CanComponents.EditCustomAttributesForSelf,
    pronunciation
  );

  return (
    <>
      {canEditCustomAttributes && (
        <div className={cx(styles.column)}>
          {data.map(({ presentation, value, label }, index) => {
            let Component = Inspector;

            if (presentation === AttributePresentation.Checkbox)
              Component = BooleanInspector;

            return (
              <>
                <Component key={index} value={value} label={label} />

                {index !== data?.length - 1 && <Gap height={12} />}
              </>
            );
          })}
        </div>
      )}
    </>
  );
};

export default memo(CustomAttributesInspector);
