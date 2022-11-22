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

const UNPERMITTED_INPUT_CHARS_REGEXP = /\.|,|\/|!|#|\$|%|\^|&|\*|\(|\)|_|\+|=|\{|\}|\[|\]|\||:|;|'|"|\\|>|<|\?|`|~/g;

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

const sanitizeNames = (namesString: string): string => {
  const names = namesString.replace(UNPERMITTED_INPUT_CHARS_REGEXP, " ");
  const splittedNames = names.split(" ");
  const trimmedNames = splittedNames.filter((name) => {
    if (name !== " ") return name.trim();
  });

  return trimmedNames.join(" ");
};

interface Props {
  termsAndConditions?: TermsAndConditions;
  controller: IFrontController;
}

const SearchContainer = (props: Props): JSX.Element => {
  const styleContext = useContext(StyleContext);
  const { t } = useTranslator(props.controller, styleContext);

  const title = t("search_widget_name", "Search");

  const [names, setNames] = useState([] as NameOption[]);
  const [loading, setLoading] = useState(false);

  const onSubmitSearch = useCallback((searchInput: string): void => {
    if (searchInput === "") return;

    const isEmail = searchInput.includes("@");

    if (isEmail) {
      const namesObj = [
        {
          key: searchInput,
          value: searchInput,
          owner: { signature: searchInput },
        },
      ];

      setNames(namesObj);
    } else {
      const value = sanitizeNames(searchInput);
      const namesObj = [
        {
          key: value,
          value,
          owner: { signature: DEFAULT_NAME_OWNER },
        },
      ];

      setNames(namesObj);
    }
    setLoading(true);
  }, []);

  const clearNames = (): void => {
    if (names.length > 0) setNames([]);
  };

  const onNamesLoaded = (): void => setLoading(false);

  return (
    <div className={cx(styles.container)}>
      <div aria-label={title} className={cx(styles.title, styles.m_10)}>
        {title}
      </div>

      <SearchBar
        onSubmit={onSubmitSearch}
        onInputChange={clearNames}
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
