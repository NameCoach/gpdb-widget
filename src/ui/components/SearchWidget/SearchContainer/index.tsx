import React, { useCallback, useContext, useState } from "react";
import classNames from "classnames/bind";
import styles from "./styles.module.css";
import { TermsAndConditions } from "../../../hooks/useRecorderState";
import IFrontController from "../../../../types/front-controller";
import StyleContext from "../../../contexts/style";
import useTranslator from "../../../hooks/useTranslator";
import SearchBar from "../SearchBar";
import { DEFAULT_NAME_OWNER } from "../../../../constants";
import { NameOption } from "../../FullNamesList";
import SearchResult from "../SearchResult";
import Loader from "../../Loader";

interface Props {
  termsAndConditions?: TermsAndConditions;
  controller: IFrontController;
}

const cx = classNames.bind(styles);

const permissions = {
  canUserResponse: { create: false },
  canPronunciation: { create: false },
  canRecordingRequest: { create: false, find: false },
  canCustomAttributes: {
    save_values: false,
    "save_values:hedb_name_badge": false,
  },
};

const replaceSplitter = (string: string): string => {
  if (string.includes(",")) return string.split(",").join(" ");

  return string;
};

const SearchContainer = (props: Props): JSX.Element => {
  const styleContext = useContext(StyleContext);
  const t = useTranslator(props.controller, styleContext);

  const title = t("search_widget_name", "Search");

  const [names, setNames] = useState([] as NameOption[]);
  const [loading, setLoading] = useState(false);

  const onSearchSubmit = useCallback((name: string): void => {
    if (name === "") return;

    const _name = replaceSplitter(name);

    const nameIsEmail = _name.includes("@");
    const ownerSignature = nameIsEmail ? _name : DEFAULT_NAME_OWNER;

    const _names = [
      {
        key: _name,
        value: _name,
        owner: { signature: ownerSignature },
      },
    ];

    setNames(_names);
    setLoading(true);
  }, []);

  const onInputChange = (): void => setNames([]);
  const onNamesLoaded = (): void => setLoading(false);

  return (
    <div className={cx(styles.container)}>
      <div aria-label={title} className={cx(styles.title, styles.m_10)}>
        {title}
      </div>

      <SearchBar
        onSubmit={onSearchSubmit}
        onInputChange={onInputChange}
        controller={props.controller}
      />

      {names.length > 0 && (
        <SearchResult
          termsAndConditions={props.termsAndConditions}
          names={names}
          controller={props.controller}
          permissions={permissions}
          onNamesLoaded={onNamesLoaded}
        />
      )}

      {loading && (
        <div className={cx(styles.center)}>
          <Loader inline />
        </div>
      )}
    </div>
  );
};

export default SearchContainer;
