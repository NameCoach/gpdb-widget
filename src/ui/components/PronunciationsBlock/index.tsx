import React, { useContext, useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import { TermsAndConditions } from "../../hooks/useRecorderState";
import FullNamesList, { NameOption } from "../FullNamesList";

import styles from "./styles.module.css";
import IFrontController from "../../../types/front-controller";

import { UserPermissions } from "../../../types/permissions";
import StyleContext from "../../contexts/style";
import useTranslator from "../../hooks/useTranslator";
import useCustomFeatures from "../../hooks/useCustomFeatures";
import useFeaturesManager, { ShowComponents } from "../../hooks/useFeaturesManager";
import { usePronunciations } from "../../hooks/pronunciations";
import Pronunciation from "../../../types/resources/pronunciation";
import Name, { NameTypes } from "../../../types/resources/name";
import { NameOwner } from "gpdb-api-client";
import { AnalyticsEventType } from "../../../types/resources/analytics-event-type";
import NameLinesResult from "../NamelinesResult";
import nameToKeyTypeObjectsArray from "../../../core/utils/name-to-key-type-objects-array";

interface Props {
  names: NameOption[];
  onSelect?: (NameOption) => void;
  termsAndConditions?: TermsAndConditions;
  controller: IFrontController;
  permissions?: UserPermissions;
}

const cx = classNames.bind(styles);

const PronunciationsBlock = (props: Props): JSX.Element => {
  const styleContext = useContext(StyleContext);
  const { t } = useTranslator(props.controller, styleContext);

  const customFeatures = useCustomFeatures(props.controller);

  const { can, show } = useFeaturesManager(
    props.controller.permissions,
    customFeatures,
    props.permissions
  );

  const {
    pronunciations,
    setPronunciations,
    updatePronunciationsByType,
  } = usePronunciations();

  const [currentPronunciation, setCurrent] = useState<Pronunciation>(null);
  const [loading, setLoading] = useState(false);
  const [nameParts, setNameParts] = useState<Name[]>([]);
  const [nameOwner, setNameOwner] = useState<NameOwner>(null);

  const fullNamesObject = useRef([]);

  const nameParser = props.controller.nameParser;

  const canComplexSearch = can("pronunciation", "search");
  const canSearchBySig = can("pronunciation", "search_by_sig");

  const searchBySig = async (name: NameOption): Promise<void> => {
    const nameOwner = { signature: name.value, email: name.value };
    const [names, result] = await props.controller.searchBySig(nameOwner);

    const fullName = names.find((n) => n.type === NameTypes.FullName);

    fullNamesObject.current =
      typeof fullName === "object"
        ? [{ key: name.key, value: fullName.key, owner: nameOwner }]
        : [name];

    const _current = result.fullName[0];
    setCurrent(_current);

    if (_current) return setLoading(false);

    setNameParts(
      names
        .filter((n) => n.type !== NameTypes.FullName)
        .map((name) => ({
          ...name,
          exist: result[name.type].length !== 0,
        }))
    );

    setPronunciations(result);

    setLoading(false);
  };

  const sendAnalytics = (name: NameOption): PromiseLike<void> => {
    const names = nameToKeyTypeObjectsArray(name.value, nameParser);

    return props.controller.sendAnalytics(
      AnalyticsEventType.Available,
      Object.values(names)
    );
  };

  const complexSearch = async (name: NameOption): Promise<void> => {
    fullNamesObject.current = [name];
    const names = nameToKeyTypeObjectsArray(name.value, nameParser);

    const result = await props.controller.complexSearch(names, name.owner);

    const _current = result.fullName[0];

    setCurrent(_current);

    if (_current?.nameOwnerCreated) return setLoading(false);

    setNameParts(
      names
        .filter((n) => n.type !== NameTypes.FullName)
        .map((name) => ({
          ...name,
          exist: result[name.type].length !== 0,
        }))
    );

    setPronunciations(result);

    setLoading(false);
  };

  const simpleSearch = async (name: NameOption): Promise<void> => {
    const pronunciations = await props.controller.simpleSearch(
      {
        key: name.value,
        type: NameTypes.FullName,
      },
      name.owner
    );

    setCurrent(pronunciations[0]);
    setLoading(false);
  };

  const loadName = async (name: NameOption): Promise<void> => {
    setLoading(true);

    setNameOwner(name.owner);

    if (name.value.includes("@") && canSearchBySig) {
      return await searchBySig(name);
    }

    if (canComplexSearch) {
      return await complexSearch(name)
        .then(() => sendAnalytics(name))
        .catch((e) => console.log(e));
    }

    return await simpleSearch(name);
  };

  const onSelect = (name: NameOption): Promise<void> => {
    const owner = props.names.find((n) => n.key === name.key).owner;

    setNameParts([]);

    return loadName({ ...name, owner });
  };

  return (
    <>
      {show(ShowComponents.PronunciationsBlock) && (
        <div className={styles.container}>
          <div className={cx(styles.title, styles.m_10)}>
            {t("pronunciations_section_name", "Pronunciations")}
          </div>

          <FullNamesList
            names={props.names}
            onSelect={onSelect}
            value={currentPronunciation}
            loading={loading}
            hideFullName={
              canComplexSearch && !currentPronunciation && nameParts.length > 0
            }
          />

          {canComplexSearch && !currentPronunciation && (
            <NameLinesResult
              controller={props.controller}
              nameOwner={nameOwner}
              loading={loading}
              setLoading={setLoading}
              usePronunciations={{
                pronunciations,
                setPronunciations,
                updatePronunciationsByType,
              }}
              useNameParts={{
                nameParts,
                setNameParts,
              }}
              permissions={props.permissions}
            />
          )}
        </div>
      )}
    </>
  );
};

export default PronunciationsBlock;
