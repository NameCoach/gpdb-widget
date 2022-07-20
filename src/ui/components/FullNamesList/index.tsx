import React, { useEffect, useMemo, useState, useContext } from "react";
import Tooltip from "../Tooltip";
import Select, { Option } from "../Select";
import Pronunciation from "../../../types/resources/pronunciation";
import styles from "./styles.module.css";
import { NameOwner } from "gpdb-api-client";
import StyleContext from "../../contexts/style";
import FullNameLine from "../FullNameLine";

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

const selectStyles = {
  control: {
    fontWeight: 400,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    borderRadius: "6px",
    border: "none",
  },
  valueContainer: {
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
  },
  singleValue: {
    textOverflow: "initial",
    whiteSpace: "normal",
    wordBreak: "break-word",
  },
  menu: {
    lineHeight: "17px",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    borderRadius: "6px",
    border: "none",
  },
  menuList: {
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
    color: "#333333",
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
      <div className={styles.wrapper}>
        <div className={styles.control}>
          <Tooltip
            className={styles.tooltip}
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
              filterOption={(o) => o.value !== selectValue.value}
            />
          </div>
        </div>
        {!props.hideFullName && selectValue && (
          <FullNameLine
            pronunciation={props.value}
            fullName={selectValue.label}
            autoplay={autoplay}
            loading={props.loading}
          />
        )}
      </div>
    </>
  );
};

export default FullNamesList;
