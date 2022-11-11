import React, { useMemo, useContext } from "react";
import Tooltip from "../../Tooltip";
import Select, { Option } from "../../Select";
import Pronunciation from "../../../../types/resources/pronunciation";
import styles from "../styles.module.css";
import { NameOwner } from "gpdb-api-client";
import StyleContext from "../../../contexts/style";
import useTheme from "../../../hooks/useTheme";
import generateTooltipId from "../../../../core/utils/generate-tooltip-id";

export interface NameOption {
  key: string;
  value: string;
  owner?: NameOwner;
}

export interface Props {
  names: NameOption[];
  value: Pronunciation;
  onSelect?: (NameOption) => PromiseLike<void>;
  setAutoplay: React.Dispatch<React.SetStateAction<boolean>>;
  selectValue?: Option;
  setValue: React.Dispatch<React.SetStateAction<Option>>;
  tooltipId?: string;
}

const nameToOption = (name: NameOption): Option => ({
  label: name.value,
  value: name.key,
});

const NamesList = ({
  names,
  selectValue,
  setAutoplay,
  setValue,
  onSelect,
  tooltipId = generateTooltipId("names_list"),
}: Props): JSX.Element => {
  const { t } = useContext(StyleContext);
  const { theme, selectStyles, filterOption } = useTheme(NamesList.name);

  const options = useMemo(() => names.map(nameToOption), [names]);

  const onChange = async (name): Promise<void> => {
    const _name: NameOption = { key: name.value, value: name.label };
    setValue(nameToOption(_name));

    if (onSelect) await onSelect(_name);

    setAutoplay(true);
  };

  const selectControlCustomProps = {
    "data-for": tooltipId,
    "data-tip": t("pronunciations_drop_down_tooltip"),
  };

  return (
    <div className={styles.control}>
      <Tooltip
        className={styles.tooltip}
        id={tooltipId}
        place="top"
        effect="solid"
      />

      <Select
        controlCustomProps={selectControlCustomProps}
        onChange={onChange}
        options={options}
        theme={theme}
        styles={selectStyles}
        filterOption={filterOption(selectValue?.value)}
        placeholder={t("pronunciations_drop_down_placeholder")}
        notFirstSelected
      />
    </div>
  );
};

export default NamesList;
