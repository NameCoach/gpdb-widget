import React, { useContext, useEffect, useMemo, useState } from "react";
import Select, { Option } from "../Select";
import Pronunciation from "../../../types/resources/pronunciation";
import Player from "../Player";
import Loader from "../Loader";
import ControllerContext from "../../contexts/controller";
import { NameTypes } from "../../../types/resources/name";
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
  onSelect?: (NameOption) => void;
}

type PronunciationsMap = Record<string, Pronunciation[]>;

const cx = classNames.bind(styles);
const selectStyles = { fontWeight: "bold" };

const nameToOption = (name: NameOption): Option => ({
  label: name.value,
  value: name.key,
});

const FullNamesList = (props: Props) => {
  const controller = useContext(ControllerContext);
  const [autoplay, setAutoplay] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [cache, setCache] = useState<PronunciationsMap>({});
  const [current, setCurrent] = useState<Pronunciation | null>();
  const [selectValue, setValue] = useState<Option>();

  const options = useMemo(() => props.names.map(nameToOption), [props.names]);

  const load = async (name: NameOption) => {
    setLoading(true);

    const owner = props.names.find((n) => n.key === name.key).owner;
    const pronunciations =
      cache[name.key] ||
      (await controller.simpleSearch(
        {
          key: name.value,
          type: NameTypes.FullName,
        },
        owner
      ));

    if (pronunciations.length === 0) setCurrent(null);
    else {
      setCurrent(pronunciations[0]);
      setCache((m) => ({ ...m, [name.key]: Array(pronunciations[0]) }));
    }

    setLoading(false);
  };

  const onChange = (name) => {
    const _name: NameOption = { key: name.value, value: name.label };

    setValue(nameToOption(_name));

    if (props.onSelect) props.onSelect(_name);

    load(_name);
    setAutoplay(true);
  };

  useEffect(() => {
    setAutoplay(false);
    setValue(nameToOption(props.names[0]));
    load(props.names[0]);
  }, [props.names]);

  return (
    <div className={cx(styles.wrapper)}>
      <Select
        className={cx(styles.control)}
        onChange={onChange}
        options={options}
        value={selectValue}
        styles={selectStyles}
      />
      {loading && (
        <div>
          <Loader />
        </div>
      )}
      {!loading && current === null && (
        <span className={cx(styles.hint)}>not available</span>
      )}
      {!loading && current !== null && (
        <Player audioSrc={current.audioSrc} autoplay={autoplay} />
      )}
    </div>
  );
};

export default FullNamesList;
