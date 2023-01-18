import styled from "styled-components";

export const StyledGap = styled.div`
  width: ${props => (props.box || props.width || 0) + "px"};
  height: ${props => (props.box || props.height || 0) + "px"};
`;
