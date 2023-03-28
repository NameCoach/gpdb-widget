import React, { useContext, useEffect, useMemo, useState } from "react";
import Pronunciation, {
  RelativeSource,
} from "../../../types/resources/pronunciation";
import { NameTypes } from "../../../types/resources/name";
import styles from "./styles.module.css";
import Loader from "../Loader";
import { NameOwner, UserResponse } from "gpdb-api-client";
import ControllerContext from "../../contexts/controller";
import NameTypesFactory from "../../../types/name-types-factory";
import Select from "../Select";
import classNames from "classnames/bind";
import userAgentManager from "../../../core/userAgentManager";
import { getLabel } from "./helper-methods";
import { AnalyticsEventType } from "../../../types/resources/analytics-event-type";
import useTranslator from "../../hooks/useTranslator";
import useTheme from "../../hooks/useTheme";
import { Theme } from "../../../types/style-context";
import capitalizeString from "../../../core/utils/capitalize-string";
import Actions from "./Actions";
import useUserResponse from "../../hooks/useUserResponse";
import Analytics from "../../../analytics";
import { Components } from "../../../analytics/types";

const cx = classNames.bind(styles);

interface Props {
  pronunciations: Pronunciation[];
  name: string;
  type: NameTypes;
  owner?: NameOwner;
  canRecord: boolean;
  canUserResponse: boolean;
  reload: (type: NameTypes) => void;
  onRecorderClick: (
    name: string,
    type: NameTypes,
    pronunciation?: Pronunciation
  ) => void;
  isRecorderOpen?: boolean;
}

const NameLine = ({
  pronunciations,
  name,
  type,
  owner,
  canRecord,
  canUserResponse,
  reload,
  onRecorderClick,
  isRecorderOpen,
}: Props): JSX.Element => {
  const controller = useContext(ControllerContext);

  const { theme, selectStyles, filterOption } = useTheme("NameLine");
  const { t } = useTranslator(controller);

  const { isDeprecated: isOld } = userAgentManager;
  const options = useMemo(
    () =>
      pronunciations.map((p, i) => ({
        label: `${i + 1} - ${getLabel(p, t)}`,
        value: i,
      })),
    [pronunciations]
  );

  const [currentPronunciation, setPronunciation] = useState<Pronunciation>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const [value, setValue] = useState(options[0]);

  const sendAnalytics = (event, index = currentIndex): PromiseLike<void> =>
    controller.sendAnalytics(
      `${NameTypesFactory[type]}_${event}_${index}`,
      { name, type },
      currentPronunciation.id
    );

  const onSelect = (selectedOption): void => {
    const index = selectedOption.value;

    setValue(selectedOption);
    setCurrentIndex(index);
    setAutoplay(true);
    setPronunciation(pronunciations[index]);
    sendAnalytics(AnalyticsEventType.Recording_select_list_change_to, index);
  };

  const onPlayClick = (): PromiseLike<void> =>
    sendAnalytics(AnalyticsEventType.Play_button_click);

  const userResponseCallback = () => {
    sendAnalytics(AnalyticsEventType.Save_button_click);
    setPronunciation(null);
    setTimeout(() => reload(type), 1500);
  };

  const { onUserResponse } = useUserResponse({
    callBack: userResponseCallback,
    owner,
    pronunciation: currentPronunciation,
  });

  const selfPronunciation = useMemo(() => {
    return pronunciations.find(
      (item) => item.relativeSource === RelativeSource.RequesterPeer
    );
  }, [pronunciations]);

  const onRecordClick = (): void =>
    onRecorderClick && onRecorderClick(name, type, selfPronunciation);

  const { sendAnalyticsEvent } = Analytics.useAnalytics();
  const handleBookmarkClick = () => {
    onUserResponse();

    const event =
      currentPronunciation?.userResponse?.response === UserResponse.Save
        ? Analytics.AnalyticsEventTypes.Common.RemoveBookmarkPronunciation
        : Analytics.AnalyticsEventTypes.Common.BookmarkPronunciation;

    sendAnalyticsEvent(event, {
      pronunciation: currentPronunciation,
      name: { value: name, type },
      component: Components.NAMELINE,
    });
  };

  const handlePlay = () => {
    onPlayClick();

    sendAnalyticsEvent(Analytics.AnalyticsEventTypes.Common.PlayPronunciation, {
      pronunciation: currentPronunciation,
      name: { value: name, type },
      component: Components.NAMELINE,
    });
  };

  const handleSelect = (selectedOption: any) => {
    const index = selectedOption.value;

    sendAnalyticsEvent(
      Analytics.AnalyticsEventTypes.Common.SelectPronunciation,
      {
        name: {
          value: name,
          type,
        },
        pronunciation: pronunciations[index],
        options: {
          val: index,
          prevVal: pronunciations.findIndex(
            (p) => p.id === currentPronunciation.id
          ),
        },
        component: Components.NAMELINE,
      }
    );

    onSelect(selectedOption);
  };

  const handleRecordClick = (): void => {
    onRecorderClick && onRecorderClick(name, type);

    const eventType = selfPronunciation
      ? Analytics.AnalyticsEventTypes.Common.EditPronunciation
      : Analytics.AnalyticsEventTypes.Common.RecordPronunciation;

    sendAnalyticsEvent(eventType, {
      name: {
        value: name,
        type,
      },
      pronunciation: currentPronunciation,
      component: Components.NAMELINE,
    });
  };

  useEffect(() => {
    setPronunciation(pronunciations[0]);
    setValue(options[0]);
  }, [pronunciations]);

  return (
    <div
      className={cx(
        styles.pronunciation,
        styles.name_line_container,
        isOld && `name--line--old--${theme}`,
        {
          hidden: theme === Theme.Outlook ? false : isRecorderOpen,
        }
      )}
    >
      <div className={cx(styles.pronunciation, `pronunciation--${theme}`)}>
        <div className={cx(styles.name__wrapper, `wrapper--${theme}`)}>
          <span className={cx(styles.pronunciation__name, `name--${theme}`)}>
            {capitalizeString(name)}
          </span>
          {!currentPronunciation && <Loader />}
        </div>
        {currentPronunciation && (
          <div
            className={cx(styles.pronunciation__tail, `tail--${theme}`, {
              hidden: isRecorderOpen,
            })}
          >
            <div className={cx(styles.pronunciation__mid, `mid--${theme}`)}>
              <Select
                options={options}
                theme={theme}
                onChange={handleSelect}
                value={value}
                styles={selectStyles}
                filterOption={filterOption(value.value)}
              />
            </div>

            <Actions
              onUserResponse={handleBookmarkClick}
              autoplay={autoplay}
              onPlay={handlePlay}
              showRecordAction={canRecord}
              showUserResponseAction={canUserResponse}
              onRecordClick={handleRecordClick}
              rerecord={!!selfPronunciation}
              saved={
                currentPronunciation?.userResponse?.response ===
                UserResponse.Save
              }
              audioSrc={currentPronunciation?.audioSrc}
              audioCreator={currentPronunciation?.audioCreator}
            />
          </div>
        )}
      </div>

      {currentPronunciation?.phoneticSpelling && (
        <div className={styles.phonetic}>
          {currentPronunciation.phoneticSpelling}
        </div>
      )}
    </div>
  );
};

NameLine.defaultProps = {
  canRecord: true,
  canUserResponse: true,
};

export default React.memo(NameLine);
