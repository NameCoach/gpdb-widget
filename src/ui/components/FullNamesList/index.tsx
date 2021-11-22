import React, { useEffect, useMemo, useState } from "react";
import Select, { Option } from "../Select";
import Pronunciation from "../../../types/resources/pronunciation";
import Player from "../Player";
import Loader from "../Loader";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import { NameOwner } from "gpdb-api-client";

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
  hideActions?: boolean;
}

const cx = classNames.bind(styles);
const selectStyles = { fontWeight: "bold" };

const nameToOption = (name: NameOption): Option => ({
  label: name.value,
  value: name.key,
});

const FullNamesList = (props: Props): JSX.Element => {
  const [autoplay, setAutoplay] = useState<boolean>(false);
  const [selectValue, setValue] = useState<Option>();

  const options = useMemo(() => props.names.map(nameToOption), [props.names]);

  const onChange = async (name) => {
    const _name: NameOption = { key: name.value, value: name.label };
    setValue(nameToOption(_name));

    if (props.onSelect) await props.onSelect(_name);

    setAutoplay(true);
  };

  useEffect(() => {
    setAutoplay(false);
    setValue(nameToOption(props.names[0]));
  }, [props.names]);

  return (
    <>
      <div className={cx(styles.wrapper)}>
        <Select
          className={cx(styles.control)}
          onChange={onChange}
          options={options}
          value={selectValue}
          styles={selectStyles}
        />
        {props.loading && (
          <div>
            <Loader />
          </div>
        )}
        {!props.hideActions && !props.loading && !props.value && (
          <span className={cx(styles.hint)}>not available</span>
        )}
        {!props.hideActions && !props.loading && props.value && (
          <Player audioSrc={props.value.audioSrc} autoplay={autoplay} />
        )}
      </div>
      {!props.loading && props.value?.phoneticSpelling && (
        <div className={styles.phonetic}>{props.value.phoneticSpelling}</div>
      )}
    </>
  );
};

export default FullNamesList;
