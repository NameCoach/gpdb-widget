import React, { useContext, useEffect, useMemo, useState } from "react";
import Select, { Option } from "../Select";
import Pronunciation from "../../../types/resources/pronunciation";
import Player from "../Player";
import Loader from "../Loader";
import ControllerContext from "../../contexts/controller";
import Name, { NameTypes } from "../../../types/resources/name";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import { NameOwner } from "gpdb-api-client";
import NameLine from "../NameLine";
import AbsentName from "../AbsentName";
import useRecorderState, {
  TermsAndConditions,
} from "../../hooks/useRecorderState";
import { usePronunciations } from "../../hooks/pronunciations";
import Recorder from "../Recorder";

export interface NameOption {
  key: string;
  value: string;
  owner?: NameOwner;
}

export interface Props {
  names: NameOption[];
  onSelect?: (NameOption) => void;
  showLib?: boolean;
  canUserResponse?: boolean;
  canUserRequest?: boolean;
  canCreate?: boolean;
  termsAndConditions?: TermsAndConditions;
}

type PronunciationsMap = Record<NameTypes, Pronunciation[] | Pronunciation>;

const cx = classNames.bind(styles);
const selectStyles = { fontWeight: "bold" };

const nameToOption = (name: NameOption): Option => ({
  label: name.value,
  value: name.key,
});

const FullNamesList = (props: Props) => {
  const controller = useContext(ControllerContext);
  const [autoplay, setAutoplay] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [cache, setCache] = useState<PronunciationsMap>();
  const [current, setCurrent] = useState<Pronunciation | null>();
  const [selectValue, setValue] = useState<Option>();
  const [nameParts, setNameParts] = useState<Record<string, Name[]>>();
  const {
    pronunciations,
    setPronunciations,
    updatePronunciationsByType,
  } = usePronunciations();
  const [
    recorderState,
    setRecorderClosed,
    setRecorderOpen,
  ] = useRecorderState();
  const { isOpen: isRecorderOpen } = recorderState;

  const openRecorder = (name, type) =>
    setRecorderOpen(true, name, type, props.termsAndConditions);

  const simpleSearch = async (key: string | number, type: NameTypes) => {
    const name = nameParts[key].find((part) => part.type === type);

    await controller.simpleSearch(name).then((pronunciations) => {
      updatePronunciationsByType(type, pronunciations);
      setCache((m) => {
        const newCache = m;

        newCache[key][type] = pronunciations;

        return newCache;
      });
    });
  };

  const reloadName = (key: string | number) => {
    return async (type: string | number) => {
      if (type === NameTypes.LastName || type === NameTypes.FirstName)
        return await simpleSearch(key, type);
    };
  };

  const options = useMemo(() => props.names.map(nameToOption), [props.names]);

  const load = async (name: NameOption) => {
    if (!props.showLib) return;

    setLoading(true);

    if (cache && cache[name.key]) {
      setCurrent(cache[name.key].fullName);
      setPronunciations(cache[name.key]);
    } else {
      const names = await controller.verifyNames(name.value);

      setNameParts((m) => ({ ...m, [name.key]: Object.values(names) }));

      const owner = props.names.find((n) => n.key === name.key).owner;

      const { fullName, lastName, firstName } = await controller.complexSearch(
        Object.values(names),
        owner
      );

      const fullNamePronunciation = fullName[0] ? fullName[0] : null;

      setCurrent(fullNamePronunciation);

      setPronunciations({ fullName, lastName, firstName });
      setCache((m) => ({
        ...m,
        [name.key]: {
          fullName: fullNamePronunciation,
          lastName: lastName,
          firstName: firstName,
        },
      }));
    }

    setLoading(false);
  };

  const onChange = (name) => {
    const _name: NameOption = { key: name.value, value: name.label };

    setValue(nameToOption(_name));

    if (props.onSelect) props.onSelect(_name);

    load(_name);
    setAutoplay(true);
  };

  useEffect(() => {
    setAutoplay(false);
    setValue(nameToOption(props.names[0]));
    load(props.names[0]);
  }, [props.names, props.showLib]);

  return (
    <>
      <div className={cx(styles.wrapper)}>
        {selectValue && (
          <Select
            className={cx(styles.control)}
            onChange={onChange}
            options={options}
            value={selectValue}
            styles={selectStyles}
          />
        )}
        {loading && (
          <div>
            <Loader />
          </div>
        )}
        {!loading && current === null && (
          <span className={cx(styles.hint)}>not available</span>
        )}
        {!loading && current !== null && (
          <Player audioSrc={current.audioSrc} autoplay={autoplay} />
        )}
      </div>
      {props.showLib &&
        selectValue &&
        cache &&
        cache[selectValue.value] &&
        !cache[selectValue.value].fullName && (
          <>
            <div className={cx(styles.title, styles.m_20)}>
              Pronunciations from Library
            </div>
            {!isRecorderOpen &&
              nameParts[selectValue.value]
                .filter((n) => n.type !== NameTypes.FullName)
                .map((n, index) => (
                  <React.Fragment key={`${n}-${index}`}>
                    <hr className={styles.divider} />
                    {cache[selectValue.value][n.type].length > 0 ? (
                      <NameLine
                        pronunciations={pronunciations[n.type]}
                        name={n.key}
                        type={n.type}
                        reload={reloadName(selectValue.value)}
                        onRecorderClick={openRecorder}
                      />
                    ) : (
                      <AbsentName
                        name={n.key}
                        type={n.type}
                        onRecorderClick={openRecorder}
                      />
                    )}

                    {index === 1 && <hr className={styles.divider} />}
                  </React.Fragment>
                ))}

            {isRecorderOpen && !loading && (
              <Recorder
                name={recorderState.name}
                type={recorderState.type}
                onRecorderClose={setRecorderClosed}
                termsAndConditions={recorderState.termsAndConditions}
              />
            )}
          </>
        )}
    </>
  );
};

export default FullNamesList;
