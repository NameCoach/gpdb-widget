import React from "react";
import { Range } from "react-range";
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
        <div className={styles.label}>Low</div>
        <div className={styles.btn__link} onClick={onDefaultClicked}>
          Default
        </div>
        <div className={styles.label}>High</div>
      </div>
    </div>
  );
};

export default OutlookView;
