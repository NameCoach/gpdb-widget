import React, { ReactNode, useContext, useEffect, useState } from "react";
import styles from "./styles.module.css";
import nameLineStyles from "../NameLine/styles.module.css";
import Pronunciation from "../../../types/resources/pronunciation";
import Player from "../Player";
import RecordAction from "../Actions/Outlook/Record";
import { NameTypes } from "../../../types/resources/name";
import classNames from "classnames/bind";
import userAgentManager from "../../../core/userAgentManager";
import ControllerContext from "../../contexts/controller";
import { AnalyticsEventType } from "../../../types/resources/analytics-event-type";
import useTooltip from "../../kit/Tooltip/hooks/useTooltip";
import useSpeakerAttrs from "../../hooks/useSpeakerAttrs";
import Tooltip from "../../kit/Tooltip";
import generateTooltipId from "../../../core/utils/generate-tooltip-id";

const cx = classNames.bind([styles, nameLineStyles]);

const TOOLTIP_SIDE_OFFSET = 0;

interface Props {
  children: ReactNode;
  name: string;
  pronunciations: Pronunciation[];
  reload: (type: NameTypes) => void;
  onRecorderClick: (name: string, type: NameTypes) => void;
  canPronunciationCreate: boolean;
}

const FullName = (props: Props): JSX.Element => {
  const [pronunciation, setPronunciation] = useState<Pronunciation | null>();
  const { isDeprecated: isOld } = userAgentManager;
  const controller = useContext(ControllerContext);
  const tooltip = useTooltip<HTMLDivElement>();
  const { speakerTip } = useSpeakerAttrs(pronunciation?.audioCreator);

  const sendAnalytics = (eventType): PromiseLike<void> =>
    controller.sendAnalytics(
      eventType,
      { name: props.name, type: NameTypes.FullName },
      pronunciation.id
    );

  const onPlayClick = (): PromiseLike<void> =>
    sendAnalytics(AnalyticsEventType.Full_name_play_button_click);

  const onRecord = (): void =>
    props.onRecorderClick(props.name, NameTypes.FullName);

  useEffect(() => {
    setPronunciation(props.pronunciations?.[0]);
  }, [props.pronunciations, props.canPronunciationCreate]);

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
          {pronunciation && pronunciation.audioSrc && (
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
                onClick={onPlayClick}
                audioSrc={pronunciation.audioSrc}
                audioCreator={pronunciation.audioCreator}
                className={nameLineStyles.pronunciation__action}
                ref={tooltip.openerRef}
              />
            </div>
          )}
          {props.canPronunciationCreate && (
            <RecordAction
              onClick={onRecord}
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
