import React, { ReactNode } from "react";
import { StyledColumn, StyledColumnProps } from "./StyledColumn";
import { StyledGap } from "./StyledGap";

interface ColumnProps extends StyledColumnProps {
  children: ReactNode;
  gap?: number;
}

// css gap isn't supported by IE11, so we apply this hack
export const Column = ({ children, gap = null, ...props }: ColumnProps) => {
  const childrenArray = React.Children.toArray(children);
  const lastIndex = childrenArray.length - 1;

  return (
    <StyledColumn {...props}>
      {childrenArray.map((child, index) => {
        return (
          <React.Fragment key={index}>
            {child}
            {gap && index !== lastIndex && <StyledGap height={gap} />}
          </React.Fragment>
        );
      })}
    </StyledColumn>
  );
};
