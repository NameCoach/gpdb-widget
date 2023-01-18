import React, { useCallback, useMemo, useState } from "react";
import Tooltip from "../../../kit/Tooltip";
import Select, { Option, SelectRef } from "../../Select";
import Pronunciation from "../../../../types/resources/pronunciation";
import styles from "../styles.module.css";
import { NameOwner } from "gpdb-api-client";
import useTheme from "../../../hooks/useTheme";
import generateTooltipId from "../../../../core/utils/generate-tooltip-id";
import useTranslator from "../../../hooks/useTranslator";
import useTooltip from "../../../kit/Tooltip/hooks/useTooltip";

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
  const { t } = useTranslator();
  const tooltip = useTooltip<HTMLDivElement>();
  const { theme, selectStyles, filterOption } = useTheme(NamesList.name);
  const [select, setSelect] = useState<SelectRef>({} as SelectRef);
  const selectRef = useCallback((ref: SelectRef) => setSelect(ref), []);

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
        id={tooltipId}
        rightArrow
        opener={tooltip.opener}
        ref={tooltip.tooltipRef}
        disabled={select.menuOpened}
      >
        {t("pronunciations_drop_down_placeholder")}
      </Tooltip>
      <div ref={tooltip.openerRef}>
        <Select
          controlCustomProps={selectControlCustomProps}
          onChange={onChange}
          options={options}
          theme={theme}
          styles={selectStyles}
          filterOption={filterOption(selectValue?.value)}
          notFirstSelected
          ref={selectRef}
          placeholder={t("pronunciations_drop_down_placeholder")}
        />
      </div>
    </div>
  );
};

export default NamesList;
