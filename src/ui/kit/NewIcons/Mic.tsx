import { ReactComponent as Icon } from "./icons/mic.svg";
import styled from "styled-components";

export const Mic = styled(Icon)`
  color: ${(props) => props.color || "inherit"}
`;
