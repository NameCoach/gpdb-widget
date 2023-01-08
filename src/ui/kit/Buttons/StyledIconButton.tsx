import styled from "styled-components";

export const StyledIconButton = styled.button`
  display: flex;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  padding: 0;
  margin: 0;
  cursor: ${(props) => props.disabled ? "default" : "pointer"};
`
