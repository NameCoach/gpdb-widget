import React, { ChangeEventHandler, FC, LabelHTMLAttributes, ReactNode, useEffect } from "react";
import styled from "styled-components";
import { ButtonLabel } from "../../../kit/Labels";

const StyledInput = styled.input`
  display: none;
`;

interface UploaderProps {
  onFileSelected?: (e: Event) => void;
  children?: ReactNode;
  name: string;
  accept: string;
  label?: FC<{htmlFor: string, children: ReactNode}>
  [x: string]: any;
}

export const Uploader = ({
  children,
  onFileSelected,
  name,
  accept,
  label = ButtonLabel,
  ...other
}: UploaderProps) => {
  const id = String(Math.floor(Math.random() * 100000000));

  const LabelComponent = label;
  
  return (
    <>
      <LabelComponent htmlFor={id} {...other}>{children}</LabelComponent>
      <StyledInput
        id={id}
        onChange={
          (onFileSelected as unknown) as ChangeEventHandler<HTMLInputElement>
        }
        type={"file"}
        name={name}
        accept={accept}
      />
    </>
  );
};
