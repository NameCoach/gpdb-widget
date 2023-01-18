import styled from "styled-components";

export interface StyledColumnProps {
  // children horizontal aligning
  centered?: boolean;
  left?: boolean;
  right?: boolean;

  // spacing
  gap?: number | string;

  // visibility
  visible?: boolean;
  hidden?: boolean;
}

export const StyledColumn = styled.div`
  display: ${(props: StyledColumnProps) => {
    if (typeof props.visible === "boolean")
      return props.visible ? "flex" : "none";
    if (typeof props.hidden === "boolean")
      return props.hidden ? "none" : "flex";
    return "flex";
  }};
  flex-direction: column;
  align-items: ${(props: StyledColumnProps) => {
    if (props.centered) return "center";
    if (props.left) return "start";
    if (props.right) return "end";
    return "space-between";
  }};
  justify-content: center;
  gap: ${(props: StyledColumnProps) => props.gap || "0"};
  width: 100%;
  visibility: ${(props) => {
    if (typeof props.visible === "boolean")
      return props.visible ? "visible" : "hidden";
    if (typeof props.hidden === "boolean")
      return props.hidden ? "hidden" : "visible";
  }};
`;
