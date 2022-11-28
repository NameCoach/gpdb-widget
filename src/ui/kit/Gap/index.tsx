import React, { memo, useMemo } from "react";

interface Props {
  width?: number;
  height?: number;
  box?: number;
  className?: string;
}

// this was created to be used in ie11, because flex gap is not supported
const Gap = ({ width = 0, height = 0, box, className }: Props) => {
  const style = useMemo(() => {
    return box
      ? {
          width: box.toString() + "px",
          height: box.toString() + "px",
        }
      : {
          width: width.toString() + "px",
          height: height.toString() + "px",
        };
  }, [width, height]);

  return <div style={style} className={className} />;
};

export default memo(Gap);
