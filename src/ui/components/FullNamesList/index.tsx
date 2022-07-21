import React, { useEffect, useMemo, useState, useContext } from "react";
import Tooltip from "../Tooltip";
import Select, { Option } from "../Select";
import Pronunciation from "../../../types/resources/pronunciation";
import styles from "./styles.module.css";
import { NameOwner } from "gpdb-api-client";
import StyleContext from "../../contexts/style";
import FullNameLine from "../FullNameLine";
import useTheme from "../../hooks/useTheme";

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

const FullNamesList = (props: Props): JSX.Element => {
  const [autoplay, setAutoplay] = useState<boolean>(false);
  const [selectValue, setValue] = useState<Option>();
  const tooltipId = Date.now().toString();
  const { t } = useContext(StyleContext);
  const { selectStyles, filterOption } = useTheme(FullNamesList.name);

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
              filterOption={filterOption(selectValue?.value)}
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
