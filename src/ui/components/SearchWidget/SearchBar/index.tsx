import classNames from "classnames/bind";
import React, { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { MIN_INPUT_SYMBOLS_TO_SUGGEST } from "../../../../constants";
import IFrontController from "../../../../types/front-controller";
import IconButtons from "../../../kit/IconButtons";
import useTranslator from "../../../hooks/useTranslator";
import styles from "./styles.module.css";

const cx = classNames.bind(styles);

interface Props {
  onSubmit: (name: string) => void;
  onInputChange: () => void;
  controller: IFrontController;
}

const ENTER_KEY_NAME = "Enter";
const ENTER_KEY_CODE = 13;
const HANDLE_SUBMIT_DELAY = 300;
const GET_SUGGESTIONS_DELAY = 500;
const ZERO_ARRAY_LENGTH = 0;

const SearchBar = ({
  onSubmit,
  onInputChange,
  controller,
}: Props): JSX.Element => {
  const { t } = useTranslator(controller);

  const [input, setInput] = useState("");

  const [renderSuggestions, setRenderSuggestions] = useState(false);
  const [
    disableDebouncedCallbackResult,
    setDisableDebouncedCallbackResult,
  ] = useState(false);
  const [suggestedNames, setSuggestedNames] = useState<Array<string>>([]);

  const handleSubmit = useDebouncedCallback((): void => {
    setRenderSuggestions(false);
    onSubmit(input.trim());
  }, HANDLE_SUBMIT_DELAY);

  const handleKeyPressed = ({ key, keyCode }): void =>
    (key === ENTER_KEY_NAME || keyCode === ENTER_KEY_CODE) && handleSubmit();

  const getNamesToSuggest = useDebouncedCallback(async (name: string) => {
    const names = await controller.getSuggestions(name);

    if (names.length > ZERO_ARRAY_LENGTH) {
      setRenderSuggestions(true);
      setSuggestedNames(names);
    }

    if (disableDebouncedCallbackResult === true) {
      setDisableDebouncedCallbackResult(false);
      setRenderSuggestions(false);
    }
  }, GET_SUGGESTIONS_DELAY);

  const handleChange = ({ target: { value } }) => {
    onInputChange();
    setInput(value);

    if (value.length < MIN_INPUT_SYMBOLS_TO_SUGGEST) {
      setDisableDebouncedCallbackResult(true);

      return setRenderSuggestions(false);
    }

    if (value.length >= MIN_INPUT_SYMBOLS_TO_SUGGEST) {
      setDisableDebouncedCallbackResult(false);

      return getNamesToSuggest(value.trim());
    }
  };

  const handleSuggestionClick = (name: string) => {
    setInput(name);

    handleSubmit();
  };

  return (
    <>
      <div className={cx(styles.row)}>
        <input
          aria-label="Search input field"
          className={cx(styles.input)}
          placeholder={t("search_widget_input_placeholder")}
          type="text"
          required
          value={input}
          onChange={handleChange}
          onKeyPress={handleKeyPressed}
        />

        <IconButtons.Search
          onClick={handleSubmit}
          className={styles.search_button_icon}
        />
      </div>

      <div className={cx(styles.row, styles.suggestions_block)}>
        {renderSuggestions &&
          suggestedNames.length > 0 &&
          suggestedNames.map((name, key) => (
            <div
              className={cx(styles.suggestion_line)}
              key={key}
              onClick={(): void => handleSuggestionClick(name)}
            >
              <p className={cx(styles.suggestion_name)}>{name}</p>
            </div>
          ))}
      </div>
    </>
  );
};

export default SearchBar;
