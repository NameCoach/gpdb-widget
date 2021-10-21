import React, { useState } from "react";
import { SEARCH_BOX_TIP } from "../../../../constants";
import styles from "../../PronunciationMyInfoWidget/styles.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const Header = (): JSX.Element => {
  const [state, setState] = useState(false);

  const tooltipChangeState = (): void => {
    state ? setState(false) : setState(true);
  };

  const renderContainer = (): JSX.Element => (
    <div>
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
    </div>
  );

  return renderContainer();
};

export default Header;
