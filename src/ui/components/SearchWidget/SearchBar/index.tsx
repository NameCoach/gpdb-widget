import classNames from "classnames/bind";
import React, { useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { MIN_INPUT_SYMBOLS_TO_SUGGEST } from "../../../../constants";
import IFrontController from "../../../../types/front-controller";
import IconButtons from "../../../kit/IconButtons";
import useTranslator from "../../../hooks/useTranslator";
import styles from "./styles.module.css";
import Tooltip from "../../../kit/Tooltip";
import useTooltip from "../../../kit/Tooltip/hooks/useTooltip";
import SuggestedNames from "../SuggestedNames";

const cx = classNames.bind(styles);

interface Props {
  onSubmit: (name: string) => void;
  onInputChange: () => void;
  controller: IFrontController;
}

enum KeyBoardKeys {
  ENTER = "Enter",
  ARROW_UP_KEY = "ArrowUp",
  ARROW_DOWN_KEY = "ArrowDown",
}

const HANDLE_SUBMIT_DELAY = 300;
const SEARCH_TOOLTIP_SIDE_OFFSET = 0;
const GET_SUGGESTIONS_DELAY = 1000;

type FocusableElement = HTMLDivElement | HTMLInputElement;
type ContainerElement = HTMLDivElement & {
  suggestedNamesCache: { [x: string]: string[] };
  focusableElements: FocusableElement[];
  focusedElement: FocusableElement;
};

const SearchBar = ({
  onSubmit,
  onInputChange,
  controller,
}: Props): JSX.Element => {
  const { t } = useTranslator(controller);
  const iconTip = useTooltip<HTMLButtonElement>();

  const containerRef = useRef<ContainerElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestedNamesRef = useRef<HTMLDivElement>(null);

  const [suggestedNames, setSuggestedNames] = useState<Array<string>>([]);

  const handleSubmit = useDebouncedCallback((): void => {
    setSuggestedNames([]);

    onSubmit(inputRef.current.value.trim());
  }, HANDLE_SUBMIT_DELAY);

  const handleKeyPressed = ({ key }: React.KeyboardEvent): void =>
    key === KeyBoardKeys.ENTER && handleSubmit();

  const getNamesToSuggest = useDebouncedCallback(async (name: string) => {
    const suggestedNamesCache = containerRef.current.suggestedNamesCache || {};

    const names =
      suggestedNamesCache[name] || (await controller.getSuggestions(name));

    containerRef.current.suggestedNamesCache = suggestedNamesCache;
    containerRef.current.suggestedNamesCache[name] = names;

    setSuggestedNames(names);
  }, GET_SUGGESTIONS_DELAY);

  const clearInput = (): void => {
    onInputChange();

    containerRef.current.focusableElements = null;
    containerRef.current.focusedElement = null;
  };

  const handleChange = ({ target: { value } }): Promise<void> => {
    clearInput();

    if (value.length >= MIN_INPUT_SYMBOLS_TO_SUGGEST) {
      return getNamesToSuggest(value.trim().toLowerCase());
    } else {
      getNamesToSuggest.cancel();
      setSuggestedNames([]);
    }
  };

  const handleSuggestionClick = (name: string): void => {
    inputRef.current.value = name;

    handleSubmit();
  };

  const handleKeyDown = ({ key }): void => {
    if (suggestedNames.length === 0) return;

    if (
      ![
        KeyBoardKeys.ENTER,
        KeyBoardKeys.ARROW_DOWN_KEY,
        KeyBoardKeys.ARROW_UP_KEY,
      ].includes(key)
    )
      return;

    const focusableElements = containerRef.current?.focusableElements || [
      inputRef.current,
      ...((suggestedNamesRef.current
        .children as unknown) as FocusableElement[]),
    ];
    const focusedElement =
      containerRef.current?.focusedElement || inputRef.current;
    const focusedElementIndex = focusableElements.indexOf(focusedElement);

    if (
      key === KeyBoardKeys.ARROW_DOWN_KEY &&
      focusedElementIndex !== focusableElements.length - 1
    ) {
      const element = focusableElements[focusedElementIndex + 1];

      containerRef.current.focusedElement = element;

      element.focus();
    }

    if (key === KeyBoardKeys.ARROW_UP_KEY && focusedElementIndex > 0) {
      const element = focusableElements[focusedElementIndex - 1];

      containerRef.current.focusedElement = element;

      element.focus();
    }

    if (key === KeyBoardKeys.ENTER) {
      const value =
        (focusedElement as HTMLInputElement).value ||
        (focusedElement?.children[0] as HTMLElement).innerText;

      inputRef.current.focus();

      handleSuggestionClick(value);
    }
  };

  return (
    <div ref={containerRef} onKeyDown={handleKeyDown}>
      <div className={cx(styles.search_bar, styles.row)}>
        <input
          ref={inputRef}
          aria-label="Search input field"
          className={cx(styles.search_input)}
          placeholder={t("search_widget_input_placeholder")}
          type="text"
          required
          onChange={handleChange}
          onKeyPress={handleKeyPressed}
        />

        <Tooltip
          opener={iconTip.opener}
          ref={iconTip.tooltipRef}
          rightArrow
          arrowSideOffset={SEARCH_TOOLTIP_SIDE_OFFSET}
        >
          {t("search_widget_tip")}
        </Tooltip>
        <IconButtons.Search
          onClick={handleSubmit}
          className={styles.search_button_icon}
          ref={iconTip.openerRef}
        />
      </div>

      {suggestedNames.length > 0 && (
        <SuggestedNames
          ref={suggestedNamesRef}
          names={suggestedNames}
          onClick={handleSuggestionClick}
        />
      )}
    </div>
  );
};

export default SearchBar;
