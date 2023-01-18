import React, { useEffect, useState } from "react";
import { Option } from "../Select";
import Pronunciation from "../../../types/resources/pronunciation";
import styles from "./styles.module.css";
import { NameOwner } from "gpdb-api-client";
import FullNameLine from "../FullNameLine";
import NamesList from "./NamesList";

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
  setAutoplay: (arg: boolean) => void;
}

const FullNamesList = ({
  names,
  pronunciation,
  onSelect,
  setAutoplay
}: Props): JSX.Element => {
  const [selectValue, setValue] = useState<Option>();

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
      </div>
    </>
  );
};

export default FullNamesList;
