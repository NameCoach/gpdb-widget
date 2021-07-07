import React, { useEffect, useMemo, useState } from "react";
import IFrontController from "../../../types/front-controller";
import FullNamesList, {
  NameOption,
  Props as ListProps,
} from "../FullNamesList";
import { ControllerContext } from "../../../index";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import Pronunciation from "../../../types/resources/pronunciation";
import { NameTypes } from "../../../types/resources/name";
import Loader from "../Loader";
import Player from "../Player";
import RecordAction from "../Actions/Record";
import useRecorderState, {
  TermsAndConditions,
} from "../../hooks/useRecorderState";
import Recorder from "../Recorder";

interface Props extends ListProps {
  client: IFrontController;
  name: Omit<NameOption, "key">;
  termsAndConditions?: TermsAndConditions;
}

const cx = classNames.bind(styles);
const MyInfo = (props: Props) => {
  if (!props.name.value.trim()) throw new Error("Name shouldn't be blank");

  const client = useMemo(() => props.client, [props.client]);
  const [pronunciation, setPronunciation] = useState<Pronunciation>();
  const [loading, setLoading] = useState(true);
  const [
    recorderState,
    setRecorderClosed,
    setRecorderOpen,
  ] = useRecorderState();

  const onRecorderOpen = () =>
    setRecorderOpen(
      true,
      props.name.value,
      NameTypes.FullName,
      props.termsAndConditions
    );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const pronunciations = await client.simpleSearch(
        {
          key: props.name.value,
          type: NameTypes.FullName,
        },
        props.name.owner
      );

      setPronunciation(pronunciations[0]);
      setLoading(false);
    };

    load();
  }, [props.name]);

  return (
    <ControllerContext.Provider value={client}>
      <div className={cx(styles.container)}>
        {props.names.length !== 0 && (
          <FullNamesList names={props.names} onSelect={props.onSelect} />
        )}

        <div className={cx(styles.row)}>
          <span className={cx(styles.title)}>My info</span>

          <div className={cx(styles.actions)}>
            {loading && <Loader />}
            {!loading && pronunciation && (
              <Player audioSrc={pronunciation.audioSrc} />
            )}
            {!loading && (
              <RecordAction
                active={recorderState.isOpen}
                onClick={onRecorderOpen}
              />
            )}
          </div>
        </div>

        {recorderState.isOpen && (
          <Recorder
            name={props.name.value}
            type={NameTypes.FullName}
            onRecorderClose={setRecorderClosed}
            termsAndConditions={props.termsAndConditions}
          />
        )}
      </div>
    </ControllerContext.Provider>
  );
};

export default MyInfo;
