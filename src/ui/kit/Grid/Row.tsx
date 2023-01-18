import React, { ReactNode } from "react";
import { StyledRow, StyledRowProps } from "./StyledRow";
import { StyledGap } from "./StyledGap";

interface RowProps extends StyledRowProps {
  children: ReactNode;
  gap?: number;
}

const DEFAULT_GAP = 8;

// css gap isn't supported by IE11, so we apply this hack
export const Row = ({ children, gap = null, ...props }: RowProps) => {
  const childrenArray = React.Children.toArray(children);
  const lastIndex = childrenArray.length - 1;

  return (
    <StyledRow {...props}>
      {childrenArray.map((child, index) => {
        return (
          <React.Fragment key={index}>
            {child}
            {index !== lastIndex && <StyledGap width={gap | DEFAULT_GAP} />}
          </React.Fragment>
        );
      })}
    </StyledRow>
  );
};
