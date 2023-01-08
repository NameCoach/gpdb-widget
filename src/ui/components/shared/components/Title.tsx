import React, { ReactNode } from "react";
import { StyledH3, StyledText } from "../../../kit/Topography";

interface TitleProps {
  children: ReactNode;
}

export const Title = ({children}: TitleProps) => {
  return <StyledH3>
    <StyledText big bold>
      {children}
    </StyledText>
  </StyledH3>
};
