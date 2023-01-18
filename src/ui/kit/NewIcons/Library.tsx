import { ReactComponent as Icon } from "./icons/library.svg";
import styled from "styled-components";

export const Library = styled(Icon)`
  color: ${(props) => props.color || "inherit"}
`;
