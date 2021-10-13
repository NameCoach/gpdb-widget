import React, { useState } from "react";
import IFrontController from "../../../types/front-controller";
import { SEARCH_BOX_TIP } from "../../../constants";
import styles from "../MyInfo/styles.module.css";
import classNames from "classnames/bind";
import NamesListContainer from "./Adapter";
import { TermsAndConditions } from "../../hooks/useRecorderState";

const cx = classNames.bind(styles);

type Props = {
  client: IFrontController;
  termsAndConditions?: TermsAndConditions;
};

const SearchWidget = (props: Props): JSX.Element => {
  let inputValue = "";
  const [name, setName] = useState("");
  const [state, setState] = useState(false);

  const handleSubmit = (): void =>
    inputValue ? setName(inputValue) : setName(name);

  const handleChange = (value: string): void => {
    setName("");
    inputValue = value;
  };

  const handleEnterPressed = (e): void => {
    if (e.key === "Enter" || e.keyCode === 13) handleSubmit();
  };

  const tooltipChangeState = (): void => {
    state ? setState(false) : setState(true);
  };

  const renderContainer = (): JSX.Element => (
    <div className={cx(styles.container)}>
      <div className={cx(styles.row, styles.m_5)}>
        <div aria-label="Search" className={cx(styles.title, styles.m_20)}>
          Search
        </div>
        <div
          aria-label="Tooltip"
          className={cx(styles.player)}
          onClick={tooltipChangeState}
        >
          <i className={cx("tooltip")} />
        </div>
      </div>
      {state && <div> {SEARCH_BOX_TIP}</div>}
      <div className={cx(styles.row)}>
        <input
          aria-label="Search input field"
          className={cx(styles.input)}
          type="text"
          required
          onChange={(e): void => handleChange(e.target.value)}
          onKeyPress={(e): void => handleEnterPressed(e)}
          style={{ width: "85%", marginLeft: "20px" }}
        />
        <div
          aria-label="Search button"
          className={cx(styles.player)}
          onClick={handleSubmit}
        >
          <i className={cx("search")} />
        </div>
      </div>

      {name && (
        <NamesListContainer
          client={props.client}
          name={name}
          termsAndConditions={props.termsAndConditions}
        />
      )}
    </div>
  );

  return renderContainer();
};

export default SearchWidget;
