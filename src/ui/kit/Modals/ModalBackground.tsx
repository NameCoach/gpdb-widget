import styled from "styled-components";

interface ModalBackgroundProps {
  visible?: boolean,
  hidden?: boolean,
}

export const ModalBackground = styled.div`
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.75);

  visibility: ${(props: ModalBackgroundProps) => {
    if (typeof props.visible === "boolean")
      return props.visible ? "visible" : "hidden";
    if (typeof props.hidden === "boolean")
      return props.hidden ? "hidden" : "visible";
  }};
  
  display: ${(props: ModalBackgroundProps) => {
    if (typeof props.visible === "boolean")
      return props.visible ? "flex" : "none";
    if (typeof props.hidden === "boolean")
      return props.hidden ? "none" : "flex";
    return "flex";
  }};
`
