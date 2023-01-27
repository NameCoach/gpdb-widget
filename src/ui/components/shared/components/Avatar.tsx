import React, { useLayoutEffect, useRef, useState } from "react";
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
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${AVATAR_SIZE}px;
  height: ${AVATAR_SIZE}px;
  border 0px solid transparent;
  border-radius: 50%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: ${(props: StylecContainerProps) =>
    `url('${props.image}')` || "none"};
  background-color: ${(props: StylecContainerProps) =>
    props.backgroundColor || "transparent"};
`;

interface AvatarProps {
  src?: string;
  name?: string;
}

export const Avatar = ({ src = "", name = "" }: AvatarProps) => {
  const [image, setImage] = useState<string | null>(null);

  useLayoutEffect(() => {
    setImage(null);

    if (!src) return;

    fetch(src)
      .then((res) => res.blob())
      .then((blob) => URL.createObjectURL(blob))
      .then((url) => setImage(url))
      .catch((e) => console.log(e));
  }, [src]);

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
    <StyledContainer backgroundColor={getColorByText()} image={image}>
      {!image && (
        <StyledText medium color={COLORS.colors_white}>
          {getInitials().toUpperCase()}
        </StyledText>
      )}
    </StyledContainer>
  );
};
