import React from "react";

import Pronunciation from "../../../types/resources/pronunciation";
import styles from "./styles.module.css";
import Player from "../Player";
import CustomAttributes from "../CustomAttributes";

export interface Props {
  fullName: string;
  value: Pronunciation;
  autoplay: boolean;
}

const FullNameLine = (props: Props): JSX.Element => (
  <>
    <div className={styles.container}>
      <div className={styles.name_line}>{props.fullName}</div>
      <Player
        audioSrc={props.value.audioSrc}
        audioCreator={props.value.audioCreator}
        autoplay={props.autoplay}
      />
    </div>
    <div className={styles.phonetic}>{props.value.phoneticSpelling}</div>
    {props.value &&
      props.value.customAttributes &&
      props.value.customAttributes.length > 0 && (
        <CustomAttributes attributes={props.value.customAttributes} disabled />
      )}
  </>
);

export default FullNameLine;
