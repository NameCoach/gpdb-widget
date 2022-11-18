import React, { useContext } from "react";
import { Range } from "react-range";
import ControllerContext from "../../../../../../contexts/controller";
import useTranslator from "../../../../../../hooks/useTranslator";
import { STEP } from "../../constants";
import { OTLOOK_THUMB_STYLE } from "../../styles";
import Track from "../../Track";
import { RangeInputProps } from "../../types";
import styles from "./styles.module.css";

const OutlookView = ({
  min,
  max,
  values,
  onChange,
  onDefaultClicked,
}: RangeInputProps): JSX.Element => {
  const controller = useContext(ControllerContext);

  const { t } = useTranslator(controller);

  return (
    <div className={styles.pitch}>
      <Range
        values={values}
        step={STEP}
        min={min}
        max={max}
        onChange={onChange}
        renderTrack={Track(values, min, max)}
        renderThumb={({ props }) => (
          <div
            {...props}
            style={{
              ...props.style,
              ...OTLOOK_THUMB_STYLE,
            }}
          />
        )}
      />

      <div className={styles.flex_row}>
        <div className={styles.label}>{t("recorder_range_input_low")}</div>
        <div className={styles.btn__link} onClick={onDefaultClicked}>
          {t("recorder_range_input_default")}
        </div>
        <div className={styles.label}>{t("recorder_range_input_high")}</div>
      </div>
    </div>
  );
};

export default OutlookView;
