import React, { useState } from "react";
import IFrontController from "../../../types/front-controller";
import styles from "../PronunciationMyInfoWidget/styles.module.css";
import classNames from "classnames/bind";
import NamesListContainer from "./Adapter";
import { TermsAndConditions } from "../../hooks/useRecorderState";
import Header from "./Header";
import { Resources } from "gpdb-api-client/build/main/types/repositories/permissions";

const cx = classNames.bind(styles);

type Props = {
  client: IFrontController;
  termsAndConditions?: TermsAndConditions;
};

const SearchWidget = (props: Props): JSX.Element => {
  const canSearchWidget = props.client.permissions?.can(
    Resources.Pronunciation,
    "search-widget"
  );

  let inputValue = "";
  const [name, setName] = useState("");

  const handleSubmit = (): void =>
    inputValue ? setName(inputValue.trim()) : setName(name);

  const handleChange = (value: string): void => {
    setName("");
    inputValue = value;
  };

  const handleEnterPressed = (e): void => {
    if (e.key === "Enter" || e.keyCode === 13) handleSubmit();
  };

  const renderContainer = (): JSX.Element => (
    <div className={cx(styles.container)}>
      <Header />

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

  return canSearchWidget ? renderContainer() : <div />;
};

export default SearchWidget;
