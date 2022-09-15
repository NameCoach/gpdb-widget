import React, { useEffect, useState } from "react";
import { Option } from "../Select";
import Pronunciation from "../../../types/resources/pronunciation";
import styles from "./styles.module.css";
import { NameOwner } from "gpdb-api-client";
import FullNameLine from "../FullNameLine";
import NamesList from "./NamesList";
import CustomAttributes from "../CustomAttributes";

export interface NameOption {
  key: string;
  value: string;
  owner?: NameOwner;
}

export interface Props {
  names: NameOption[];
  value: Pronunciation;
  loading?: boolean;
  onSelect?: (NameOption) => PromiseLike<void>;
  hideFullName?: boolean;
}

const nameToOption = (name: NameOption): Option => ({
  label: name.value,
  value: name.key,
});

const FullNamesList = ({
  names,
  value,
  loading,
  onSelect,
  hideFullName,
}: Props): JSX.Element => {
  const [autoplay, setAutoplay] = useState<boolean>(false);
  const [selectValue, setValue] = useState<Option>();

  useEffect(() => {
    setAutoplay(false);
    setValue(nameToOption(names[0]));
  }, [names]);

  return (
    <>
      <div className={styles.wrapper}>
        <NamesList
          names={names}
          setAutoPlay={setAutoplay}
          value={value}
          selectValue={selectValue}
          setValue={setValue}
          onSelect={onSelect}
        />
        {!hideFullName && selectValue && (
          <FullNameLine
            pronunciation={value}
            fullName={selectValue.label}
            autoplay={autoplay}
            loading={loading}
          />
        )}
      </div>

      {!loading &&
        value &&
        value.customAttributes &&
        value.customAttributes.length > 0 && (
          <CustomAttributes attributes={value.customAttributes} disabled />
        )}
    </>
  );
};

export default FullNamesList;
