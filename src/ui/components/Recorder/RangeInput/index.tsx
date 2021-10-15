import React from "react";
import { Range, getTrackBackground } from "react-range";

import styles from "./styles.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const STEP = 0.1;

const thumbStyle = {
  height: "15px",
  width: "15px",
  borderRadius: "2px",
  backgroundColor: "#FFF",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0px 2px 2px #AAA",
};

const trackStyle = {
  height: "5px",
  width: "100%",
  borderRadius: "3px",
  alignSelf: "center",
};

const RangeInput = ({ min, max, values, onChange, onDefaultClicked }) => {
  return (
    <div className={styles.pitch}>
      <div className={styles.slider__label_container}>
        <div className={styles.slider__label}>Adjust recording audio pitch</div>
        <div
          className={styles.slider__default_pitch_value}
          onClick={onDefaultClicked}
        >
          Default
        </div>
      </div>

      <div className={cx(styles.slider__hint, { left: true })}>Low</div>
      <div className={cx(styles.slider__hint, { right: true })}>High</div>
      <Range
        values={values}
        step={STEP}
        min={min}
        max={max}
        onChange={onChange}
        renderTrack={({ props, children }) => (
          <div
            ref={props.ref}
            style={{
              ...trackStyle,
              background: getTrackBackground({
                values: values,
                colors: [styles.primaryBrandColor, styles.secondaryGray],
                min: min,
                max: max,
              }),
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props, isDragged }) => (
          <div
            {...props}
            style={{
              ...props.style,
              ...thumbStyle,
            }}
          >
            <div
              style={{
                height: "5px",
                width: "5px",
                backgroundColor: isDragged
                  ? styles.primaryBrandColor
                  : styles.secondaryGray,
              }}
            />
          </div>
        )}
      />
    </div>
  );
};

export default RangeInput;
