import React from "react";
import {
  DARKER_BRAND,
  SECONDARY_GRAY,
} from "../../../../../styles/variables/colors";
import { TRACK_STYLE } from "../styles";
import { getTrackBackground } from "react-range";

const Track = (values, min, max) => ({ props, children }) => (
  <div
    ref={props.ref}
    style={{
      ...TRACK_STYLE,
      background: getTrackBackground({
        values: values,
        colors: [DARKER_BRAND, SECONDARY_GRAY],
        min: min,
        max: max,
      }),
    }}
  >
    {children}
  </div>
);

export default Track;
