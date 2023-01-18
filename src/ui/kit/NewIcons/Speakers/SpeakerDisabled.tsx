import { ReactComponent as Icon } from "../icons/speaker-disabled.svg";
import { LIGHT_GREY } from "../../../styles/variables/colors";
import styled from "styled-components";

export const SpeakerDisabled = styled(Icon)`
  stroke: ${LIGHT_GREY};

  &:hover {
    stroke: ${LIGHT_GREY};
  }
`;
