import React, { useState } from "react";
import styled from "styled-components";
import { StyledText } from "../../../kit/Topography";
import COLORS, {
  AVATAR_PLACEHOLDER_COLORS,
} from "../../../styles/variables/colors";

const AVATAR_SIZE = 40;

interface StylecContainerProps {
  image?: string;
  backgroundColor?: string;
  scale?: number;
}

const StyledContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${AVATAR_SIZE}px;
  height: ${AVATAR_SIZE}px;
  border 0px solid transparent;
  border-radius: 50%;
  background-color: ${(props: StylecContainerProps) =>
    props.backgroundColor || "transparent"};
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border 0px solid transparent;
  border-radius: 50%;
  display: ${(props) => {
    if (typeof props.visible === "boolean")
      return props.visible ? "inline" : "none";
    if (typeof props.hidden === "boolean")
      return props.hidden ? "none" : "inline";
    return "inline";
  }};
  visibility: ${(props) => {
    if (typeof props.visible === "boolean")
      return props.visible ? "visible" : "hidden";
    if (typeof props.hidden === "boolean")
      return props.hidden ? "hidden" : "visible";
  }};
`;

interface AvatarProps {
  src?: string;
  name?: string;
}

export const Avatar = ({ src, name = "" }: AvatarProps) => {
  const [imageVisible, setImageVisible] = useState<boolean>(false);

  const imageOnLoad = () => setImageVisible(true);
  const imageOnError = (e) => {
    console.log(e);
    setImageVisible(false);
  };

  const getInitials = (): string => {
    let _name = name.trim();

    if (_name.length === 0) return "";
    if (_name.length === 1) return _name;

    const nameParts = _name.split(" ");

    if (nameParts.length > 1) {
      const firstLetter = nameParts[0][0];
      const secondLetter = nameParts[1][0];
      return firstLetter + secondLetter;
    }

    const firstLetter = nameParts[0][0];
    const secondLetter = nameParts[0][1];
    return firstLetter + secondLetter;
  };

  const getColorByText = (): string => {
    const colorsArray = Object.values(AVATAR_PLACEHOLDER_COLORS);
    const coder = new TextEncoder();

    return colorsArray[
      coder.encode(name).reduce((acc, v) => acc + v, 0) % colorsArray.length
    ];
  };

  return (
    <StyledContainer backgroundColor={getColorByText()}>
      <StyledText medium color={COLORS.colors_white}>
        {getInitials().toUpperCase()}
      </StyledText>{" "}
      <StyledImage
        visible={!!src && imageVisible}
        src={src}
        onLoad={imageOnLoad}
        onError={imageOnError}
        alt={""}
      />
    </StyledContainer>
  );
};
