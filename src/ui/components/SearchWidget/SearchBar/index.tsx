import classNames from "classnames/bind";
import React, { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { MIN_INPUT_SYMBOLS_TO_SUGGEST } from "../../../../constants";
import IFrontController from "../../../../types/front-controller";
import IconButtons from "../../../kit/IconButtons";
import useTranslator from "../../../hooks/useTranslator";
import styles from "./styles.module.css";
import Tooltip from "../../../kit/Tooltip";
import useTooltip from "../../../kit/Tooltip/hooks/useTooltip";

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
const SEARCH_TOOLTIP_SIDE_OFFSET = 0;

const SearchBar = ({
  onSubmit,
  onInputChange,
  controller,
}: Props): JSX.Element => {
  const { t } = useTranslator(controller);
  const inputTip = useTooltip<HTMLDivElement>();
  const iconTip = useTooltip<HTMLButtonElement>();

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
        <div className={cx(styles.input_container)}>
          <Tooltip
            opener={inputTip.opener}
            ref={inputTip.tooltipRef}
          >
            {t("search_widget_tip")}
          </Tooltip>
          <input
            aria-label="Search input field"
            className={cx(styles.input)}
            placeholder={t("search_widget_input_placeholder")}
            type="text"
            required
            value={input}
            onChange={handleChange}
            onKeyPress={handleKeyPressed}
            ref={inputTip.openerRef}
          />
        </div>
        <div >
          <Tooltip
            opener={iconTip.opener}
            ref={iconTip.tooltipRef}
            rightArrow
            arrowSideOffset={SEARCH_TOOLTIP_SIDE_OFFSET}
          >
            {t("search_widget_tip")}
          </Tooltip>
          <IconButtons.Search
            className={styles.search_button_icon}
            onClick={handleSubmit}
            ref={iconTip.openerRef}
          />
        </div>
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
