import React, { useEffect, useMemo, useState, useContext } from "react";
import Tooltip from "../Tooltip";
import Select, { Option } from "../Select";
import Pronunciation from "../../../types/resources/pronunciation";
import Player from "../Player";
import Loader from "../Loader";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import { NameOwner } from "gpdb-api-client";
import StyleContext from "../../contexts/style";

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
const selectStyles = {
  control: { fontWeight: "bold" },
  singleValue: {
    textOverflow: "initial",
    whiteSpace: "normal",
    wordBreak: "break-word",
  },
};

const nameToOption = (name: NameOption): Option => ({
  label: name.value,
  value: name.key,
});

const FullNamesList = (props: Props): JSX.Element => {
  const [autoplay, setAutoplay] = useState<boolean>(false);
  const [selectValue, setValue] = useState<Option>();
  const tooltipId = Date.now().toString();
  const { t } = useContext(StyleContext);

  const options = useMemo(() => props.names.map(nameToOption), [props.names]);

  const onChange = async (name): Promise<void> => {
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
        <div className={cx(styles.control)}>
          <Tooltip
            className={cx(styles.tooltip)}
            id={tooltipId}
            place="top"
            effect="solid"
          />

          <div
            data-tip={t(
              "pronunciations_drop_down_tooltip",
              "Click down arrow in drop down to see more names"
            )}
            data-for={tooltipId}
          >
            <Select
              onChange={onChange}
              options={options}
              value={selectValue}
              styles={selectStyles}
            />
          </div>
        </div>
        {props.loading && (
          <div>
            <Loader />
          </div>
        )}
        {!props.hideActions && !props.loading && !props.value && (
          <span className={cx(styles.hint)}>not available</span>
        )}
        {!props.hideActions && !props.loading && props.value && (
          <Player
            audioSrc={props.value.audioSrc}
            audioCreator={props.value.audioCreator}
            autoplay={autoplay}
          />
        )}
      </div>
      {!props.loading && props.value?.phoneticSpelling && (
        <div className={styles.phonetic}>{props.value.phoneticSpelling}</div>
      )}
    </>
  );
};

export default FullNamesList;
