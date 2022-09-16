import classNames from "classnames/bind";
import React, { useContext } from "react";
import { Range } from "react-range";
import ControllerContext from "../../../../../../contexts/controller";
import useTranslator from "../../../../../../hooks/useTranslator";
import {
  DARKER_BRAND,
  SECONDARY_GRAY,
} from "../../../../../../styles/variables/colors";
import { STEP } from "../../constants";
import { THUMB_STYLE } from "../../styles";
import Track from "../../Track";
import { RangeInputProps } from "../../types";
import styles from "./styles.module.css";

const cx = classNames.bind(styles);

const DefaultView = ({
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
      <div className={styles.slider__label_container}>
        <div className={styles.slider__label}>
          {t("recorder_range_input_adjust_audio_pitch")}
        </div>

        <div
          className={styles.slider__default_pitch_value}
          onClick={onDefaultClicked}
        >
          {t("recorder_range_input_default")}
        </div>
      </div>

      <div className={cx(styles.slider__hint, { left: true })}>
        {t("recorder_range_input_low")}
      </div>
      <div className={cx(styles.slider__hint, { right: true })}>
        {t("recorder_range_input_high")}
      </div>

      <Range
        values={values}
        step={STEP}
        min={min}
        max={max}
        onChange={onChange}
        renderTrack={Track(values, min, max)}
        renderThumb={({ props, isDragged }) => (
          <div
            {...props}
            style={{
              ...props.style,
              ...THUMB_STYLE,
            }}
          >
            <div
              style={{
                height: "5px",
                width: "5px",
                backgroundColor: isDragged ? DARKER_BRAND : SECONDARY_GRAY,
              }}
            />
          </div>
        )}
      />
    </div>
  );
};

export default DefaultView;
