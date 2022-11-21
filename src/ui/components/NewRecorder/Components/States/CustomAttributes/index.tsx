import React from "react";
import { useRecorder } from "../../../hooks/useRecorder";
import CustomAttributes from "../../../../CustomAttributes";

const CustomAttributesState = (): JSX.Element => {
  const {
    onCustomAttributesSaved,
    onCustomAttributesBack,
    handleOnRecorderClose,
  } = useRecorder();

  const { canCustomAttributesCreate, pronunciation, owner } = useRecorder();

  return (
    <>
      {canCustomAttributesCreate && (
        <>
          <CustomAttributes
            attributes={pronunciation?.customAttributes}
            disabled={false}
            saving
            noBorder
            owner={owner}
            onCustomAttributesSaved={onCustomAttributesSaved}
            onBack={onCustomAttributesBack}
            onRecorderClose={handleOnRecorderClose}
          />
        </>
      )}
    </>
  );
};

export default CustomAttributesState;
