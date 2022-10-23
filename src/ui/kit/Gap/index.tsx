import React from "react";

interface Props {
  width?: number;
  height?: number;
  box?: number;
  className?: string;
}

const Gap = ({ width = 0, height = 0, box, className }: Props) => {
  const style = box
    ? {
        width: box.toString() + "px",
        height: box.toString() + "px",
      }
    : {
        width: width.toString() + "px",
        height: height.toString() + "px",
      };

  return <div style={style} className={className} />;
};

export default Gap;
