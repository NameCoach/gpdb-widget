import React, { ReactNode } from "react";
import styles from "./styles.module.css";
import nameLineStyles from "../NameLine/styles.module.css";
import Pronunciation from "../../../types/resources/pronunciation";
import Player from "../Player";
import RecordAction from "../Actions/Outlook/Record";
import { NameTypes } from "../../../types/resources/name";
import classNames from "classnames/bind";
import userAgentManager from "../../../core/userAgentManager";
import useTooltip from "../../kit/Tooltip/hooks/useTooltip";
import useSpeakerAttrs from "../../hooks/useSpeakerAttrs";
import Tooltip from "../../kit/Tooltip";
import generateTooltipId from "../../../core/utils/generate-tooltip-id";
import Analytics from "../../../analytics";
import { Components } from "../../../analytics/types";

const cx = classNames.bind([styles, nameLineStyles]);

const TOOLTIP_SIDE_OFFSET = 0;

interface Props {
  children: ReactNode;
  name: string;
  pronunciations: Pronunciation[];
  reload: (type: NameTypes) => void;
  onRecorderClick: (
    name: string,
    type: NameTypes,
    pronunciation?: Pronunciation
  ) => void;
  canPronunciationCreate: boolean;
}

const FullName = (props: Props): JSX.Element => {
  const pronunciation = props.pronunciations?.[0];
  const { isDeprecated: isOld } = userAgentManager;
  const tooltip = useTooltip<HTMLDivElement>();
  const { speakerTip } = useSpeakerAttrs(pronunciation?.audioCreator);

  const { sendAnalyticsEvent } = Analytics.useAnalytics();

  const handlePlayClick = () => {
    sendAnalyticsEvent(Analytics.AnalyticsEventTypes.Common.PlayPronunciation, {
      name: {
        value: props.name,
        type: NameTypes.FullName,
      },
      pronunciation,
      component: Components.FULLNAMELINE,
    });
  };

  const handleRecordClick = () => {
    props.onRecorderClick(
      props.name,
      NameTypes.FullName,
      pronunciation?.selfRecorded ? pronunciation : undefined
    );

    const event = pronunciation?.selfRecorded
      ? Analytics.AnalyticsEventTypes.Common.EditPronunciation
      : Analytics.AnalyticsEventTypes.Common.RecordPronunciation;

    sendAnalyticsEvent(event, {
      name: {
        value: props.name,
        type: NameTypes.FullName,
      },
      pronunciation,
      component: Components.FULLNAMELINE,
    });
  };

  return (
    <div className={styles.head__container}>
      <div className={styles.head}>
        <div className={styles.head__names}>
          <span>{props.children}</span>
        </div>

        <div
          className={
            isOld ? cx(styles.head__actions, styles.old) : styles.head__actions
          }
        >
          {pronunciation?.audioSrc && (
            <div>
              <Tooltip
                opener={tooltip.opener}
                ref={tooltip.tooltipRef}
                rightArrow
                id={generateTooltipId("player")}
                arrowSideOffset={TOOLTIP_SIDE_OFFSET}
              >
                {speakerTip}
              </Tooltip>
              <Player
                onClick={handlePlayClick}
                audioSrc={pronunciation.audioSrc}
                audioCreator={pronunciation.audioCreator}
                className={nameLineStyles.pronunciation__action}
                ref={tooltip.openerRef}
              />
            </div>
          )}
          {props.canPronunciationCreate && (
            <RecordAction
              onClick={handleRecordClick}
              rerecord={pronunciation?.selfRecorded}
            />
          )}
        </div>
      </div>

      {pronunciation?.phoneticSpelling && (
        <div className={styles.phonetic}>{pronunciation.phoneticSpelling}</div>
      )}
    </div>
  );
};

export default FullName;
