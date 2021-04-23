import React from "react";
import Pronunciation from "../../../types/resources/pronunciation";
import { NameTypes } from "../../../types/resources/name";
import styles from "./styles.module.css";
import Loader from "../Loader";

interface Props {
  pronunciations: Pronunciation[];
  name: string;
  type: NameTypes;
}

const NameLine = (props: Props) => (
  <div className={styles.pronunciation}>
    <span className={styles.pronunciation__name}>{props.name}</span>

    {props.pronunciations.length === 0 ? <Loader /> : <div>1</div>}
  </div>
);

export default NameLine;
