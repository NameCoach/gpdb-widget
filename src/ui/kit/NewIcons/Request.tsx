import { ReactComponent as Icon } from "./icons/request.svg";
import styled from "styled-components";
import { DARK_GREY, LIGHT_GREY } from "../../styles/variables/colors";

export const Request = styled(Icon)`
  stroke: ${(props) => {
    if (props.disabled) return "#AFAFAF";
    return LIGHT_GREY;
  }};

  &:hover {
    stroke: ${(props) => {
      if (props.disabled) return "#AFAFAF";
      return DARK_GREY;
    }};
  }
`;
