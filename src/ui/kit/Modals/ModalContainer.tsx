import styled from "styled-components";
import { DARKER_BRAND, WHITE } from "../../styles/variables/colors";

export const ModalContainer = styled.div`
  display: flex;
  background: ${WHITE};
  border: 2px solid ${DARKER_BRAND};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  position: relative;
  width: auto;
  margin: 0 5% 0 5%;
  padding: 10px;
`;
