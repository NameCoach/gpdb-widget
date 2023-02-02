import styled from "styled-components";

export interface StyledRowProps {
  // children horizontal aligning
  centered?: boolean;
  left?: boolean;
  right?: boolean;

  // spacing
  gap?: number | string;
  padding?: string;

  // width
  fullWidth?: boolean;
  autoWidth?: boolean;

  // visibility
  visible?: boolean;
  hidden?: boolean;

  // flex
  flex?: string;

  borderBox?: boolean;
}

export const StyledRow = styled.div`
  display: ${(props: StyledRowProps) => {
    if (typeof props.visible === "boolean")
      return props.visible ? "flex" : "none";
    if (typeof props.hidden === "boolean")
      return props.hidden ? "none" : "flex";
    return "flex";
  }};
  flex-direction: row;
  align-items: center;
  justify-content: ${(props: StyledRowProps) => {
    if (props.centered) return "center";
    if (props.left) return "start";
    if (props.right) return "end";
    return "space-between";
  }};
  gap: ${(props: StyledRowProps) => props.gap || "0"};
  padding: ${(props: StyledRowProps) => props.padding || "0"};
  width: ${(props: StyledRowProps) => {
    if (props.fullWidth) return "100%";
    if (props.autoWidth) return "auto";
    return "100%";
  }};
  visibility: ${(props: StyledRowProps) => {
    if (typeof props.visible === "boolean")
      return props.visible ? "visible" : "hidden";
    if (typeof props.hidden === "boolean")
      return props.hidden ? "hidden" : "visible";
  }};
  box-sizing: ${(props) => {
    if (props.borderBox) return "border-box";
    return "content-box";
  }};
  flex: ${(props: StyledRowProps) => {
    if (props.flex) return props.flex;
    return "0 1 auto";
  }};
`;
