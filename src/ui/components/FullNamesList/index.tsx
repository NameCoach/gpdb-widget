import React, { useEffect, useState } from "react";
import { Option } from "../Select";
import Pronunciation from "../../../types/resources/pronunciation";
import styles from "./styles.module.css";
import { NameOwner } from "gpdb-api-client";
import FullNameLine from "../FullNameLine";
import NamesList from "./NamesList";
import CustomAttributesInspector from "../Outlook/CustomAttributesInspector";

export interface NameOption {
  key: string;
  value: string;
  owner?: NameOwner;
}

export interface Props {
  names: NameOption[];
  pronunciation: Pronunciation;
  loading?: boolean;
  onSelect?: (NameOption) => PromiseLike<void>;
  hideFullName?: boolean;
}

const FullNamesList = ({
  names,
  pronunciation,
  loading,
  onSelect,
  hideFullName,
}: Props): JSX.Element => {
  const [autoplay, setAutoplay] = useState<boolean>(false);
  const [selectValue, setValue] = useState<Option>();

  const customAttributesDataPresent =
    pronunciation?.customAttributes?.length > 0;

  useEffect(() => {
    setAutoplay(false);
  }, [names]);

  return (
    <>
      <div className={styles.wrapper}>
        <NamesList
          names={names}
          setAutoplay={setAutoplay}
          value={pronunciation}
          setValue={setValue}
          selectValue={selectValue}
          onSelect={onSelect}
        />
        {!hideFullName && selectValue && (
          <FullNameLine
            pronunciation={pronunciation}
            fullName={selectValue.label}
            autoplay={autoplay}
            loading={loading}
          />
        )}
      </div>

      {!loading && customAttributesDataPresent && (
        <CustomAttributesInspector
          data={pronunciation.customAttributes}
          pronunciation={pronunciation}
        />
      )}
    </>
  );
};

export default FullNamesList;
