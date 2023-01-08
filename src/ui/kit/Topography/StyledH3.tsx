import styled from "styled-components";

export const StyledH3 = styled.h3`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  margin: ${(props) => props.margin || 0};
`;
