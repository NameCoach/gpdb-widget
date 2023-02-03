import React, { useContext, useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import FullNamesList, { NameOption } from "../FullNamesList";

import styles from "./styles.module.css";
import IFrontController from "../../../types/front-controller";

import { UserPermissions } from "../../../types/permissions";
import StyleContext from "../../contexts/style";
import useTranslator from "../../hooks/useTranslator";
import useCustomFeatures from "../../hooks/useCustomFeatures";
import useFeaturesManager, {
  CanComponents,
  ShowComponents,
} from "../../hooks/useFeaturesManager";
import { usePronunciations } from "../../hooks/pronunciations";
import Pronunciation from "../../../types/resources/pronunciation";
import Name, { NameTypes } from "../../../types/resources/name";
import { NameOwner } from "gpdb-api-client";
import { AnalyticsEventType } from "../../../types/resources/analytics-event-type";
import NameLinesResult from "../NamelinesResult";
import nameToKeyTypeObjectsArray from "../../../core/utils/name-to-key-type-objects-array";
import stringIsEmail from "../../../core/utils/string-is-email";
import CustomAttributesInspector from "../Outlook/CustomAttributesInspector";
import { LibraryRecordingsPresenter } from "./components";
import { Column, Row } from "../../kit/Grid";
import { StyledText } from "../../kit/Topography";
import Loader from "../Loader";
import { Speaker, Title } from "../shared/components";
import { Avatar } from "../shared/components/Avatar";

interface Props {
  names: NameOption[];
  controller: IFrontController;
  permissions?: UserPermissions;
}

const cx = classNames.bind(styles);

const PronunciationsBlock = ({
  names,
  controller,
  permissions,
}: Props): JSX.Element => {
  const styleContext = useContext(StyleContext);
  const { t } = useTranslator(controller, styleContext);

  const customFeatures = useCustomFeatures(controller);

  const { can, show } = useFeaturesManager(
    controller.permissions,
    customFeatures,
    permissions
  );

  const {
    pronunciations,
    setPronunciations,
    updatePronunciationsByType,
  } = usePronunciations();

  const [currentPronunciation, setCurrent] = useState<Pronunciation>(null);
  const [nameParts, setNameParts] = useState<Name[]>([]);
  const [nameOwner, setNameOwner] = useState<NameOwner>(null);
  const [firstName, setFirstName] = useState<string>(null);
  const [lastName, setLastName] = useState<string>(null);
  const [
    firstNamePronunciation,
    setFirstNamePronunciation,
  ] = useState<Pronunciation>(null);
  const [
    lastNamePronunciation,
    setLastNamePronunciation,
  ] = useState<Pronunciation>(null);
  const [firstNamePending, setFirstNamePending] = useState<boolean>(false);
  const [lastNamePending, setLastNamePending] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string>(null);

  const loadTimeout = useRef<ReturnType<typeof setTimeout>>(null);
  const fullNamesObject = useRef([]);
  const [autoplay, setAutoplay] = useState<boolean>(false);

  const nameParser = controller.nameParser;

  const canComplexSearch = can(CanComponents.Pronunciation, "search");
  const canSearchBySig = can(CanComponents.Pronunciation, "search_by_sig");

  const searchBySig = async (name: NameOption): Promise<void> => {
    const nameOwner = { signature: name.value, email: name.value };
    const [names, result] = await controller.searchBySig(nameOwner);

    const fullName = names.find((n) => n.type === NameTypes.FullName);

    fullNamesObject.current =
      typeof fullName === "object"
        ? [{ key: name.key, value: fullName.key, owner: nameOwner }]
        : [name];

    const _current = result.fullName[0];
    setCurrent(_current);

    if (_current) return;

    setNameParts(
      names
        .filter((n) => n.type !== NameTypes.FullName)
        .map((name) => ({
          ...name,
          exist: result[name.type].length !== 0,
        }))
    );

    setPronunciations(result);
  };

  const sendAnalytics = (name: NameOption): PromiseLike<void> => {
    const names = nameToKeyTypeObjectsArray(name.value, nameParser);

    return controller.sendAnalytics(
      AnalyticsEventType.Available,
      Object.values(names)
    );
  };

  const complexSearch = async (name: NameOption): Promise<void> => {
    fullNamesObject.current = [name];
    const names = nameToKeyTypeObjectsArray(name.value, nameParser);

    const result = await controller.complexSearch(names, name.owner);

    const _current = result.fullName[0];

    setCurrent(_current);

    if (_current?.nameOwnerCreated) return;

    setNameParts(
      names
        .filter((n) => n.type !== NameTypes.FullName)
        .map((name) => ({
          ...name,
          exist: result[name.type].length !== 0,
        }))
    );

    setPronunciations(result);
  };

  const simpleSearch = async (name: NameOption): Promise<void> => {
    const pronunciations = await controller.simpleSearch(
      {
        key: name.value,
        type: NameTypes.FullName,
      },
      name.owner
    );

    setCurrent(pronunciations[0]);
  };

  const onFirstNameRecRequest = async () => {
    return await controller
      .requestRecording(firstName, NameTypes.FirstName, nameOwner)
      .then(() => setFirstNamePending(true))
      .catch((e) => {
        console.log(e);
      });
  };

  const onLastNameRecRequest = async () => {
    return await controller
      .requestRecording(lastName, NameTypes.LastName, nameOwner)
      .then(() => setLastNamePending(true))
      .catch((e) => {
        console.log(e);
      });
  };

  const loadPreferredLibRecs = async (name) => {
    if (!show(ShowComponents.LibraryRecordings)) return;

    const names = nameToKeyTypeObjectsArray(name.value, nameParser).filter(
      (name) => name.type !== NameTypes.FullName
    );

    const _firstName = names.find((name) => name.type === NameTypes.FirstName)
      ?.key;
    const _lastName = names.find((name) => name.type === NameTypes.LastName)
      ?.key;

    setFirstName(_firstName);
    setLastName(_lastName);

    const result = await controller.getPreferredRecordings({
      // TODO: change userContext to outlook user in https://name-coach.atlassian.net/browse/INT-507
      userContext: name.owner,
      ownerContext: name.owner,
    });

    setFirstNamePronunciation(result.firstNamePronunciation);
    setLastNamePronunciation(result.lastNamePronunciation);

    if (!result.firstNamePronunciation) {
      const _fnRecReq = await controller.findRecordingRequest(
        _firstName,
        NameTypes.FirstName,
        name.owner
      );
      setFirstNamePending(_fnRecReq);
    }
    if (!result.lastNamePronunciation) {
      const _lnRecReq = await controller.findRecordingRequest(
        _lastName,
        NameTypes.LastName,
        name.owner
      );
      setLastNamePending(_lnRecReq);
    }
  };

  const loadAvatar = async (owner) => {
    if (!show(ShowComponents.Avatars) || !can(CanComponents.CanRequestAvatars))
      return;

    await controller
      .getAvatar(owner)
      .then((url) => setAvatarUrl(url))
      .catch((e) => console.log(e));
  };

  const loadName = async (name: NameOption): Promise<void> => {
    setLoading(true);
    setCurrent(null);
    setAvatarUrl(null);
    setNameOwner(name.owner);

    if (stringIsEmail(name.value) && canSearchBySig) {
      await searchBySig(name);
    } else if (canComplexSearch) {
      await complexSearch(name)
        .then(() => sendAnalytics(name))
        .catch((e) => console.log(e));
    } else {
      await simpleSearch(name);
    }
    await loadPreferredLibRecs(name);
    await loadAvatar(name.owner);

    loadTimeout.current = setTimeout(() => setLoading(false), 1000);
  };

  const [selectedName, setSelectedName] = useState<NameOption>(null);

  const _onSelect = (name: NameOption): Promise<void> => {
    setSelectedName(name);

    const owner = names.find((n) => n.key === name.key).owner;

    setNameParts([]);

    return loadName({ ...name, owner });
  };

  const customAttributesDataPresent =
    currentPronunciation?.customAttributes?.length > 0;

  useEffect(() => {
    return () => {
      clearTimeout(loadTimeout.current);
    };
  }, []);

  return (
    <>
      {show(ShowComponents.PronunciationsBlock) && (
        <Column gap={12}>
          <Row padding={"20px 0"}>
            <Title>{t("pronunciations_section_name", "Pronunciations")}</Title>
          </Row>

          <FullNamesList
            names={names}
            onSelect={_onSelect}
            pronunciation={currentPronunciation}
            loading={false}
            hideFullName={
              (canComplexSearch &&
                !currentPronunciation &&
                nameParts.length > 0) ||
              !!(firstNamePronunciation || lastNamePronunciation)
            }
            setAutoplay={setAutoplay}
          />

          {selectedName && (
            <Row padding={"8px 0"} gap={8}>
              {show(ShowComponents.Avatars) && (
                <Row left autoWidth flex={"0 0 auto"}>
                  <Avatar name={selectedName.value} src={avatarUrl} />
                </Row>
              )}
              <Row>
                <StyledText medium>{selectedName.value}</StyledText>
              </Row>
              <Row gap={8} right autoWidth flex={"0 0 auto"}>
                {loading ? (
                  <Loader btn />
                ) : (
                  !firstNamePronunciation &&
                  !lastNamePronunciation && (
                    <>
                      {currentPronunciation && (
                        <Speaker
                          autoplay={autoplay}
                          pronunciation={currentPronunciation}
                        />
                      )}
                    </>
                  )
                )}
              </Row>
            </Row>
          )}

          {!loading && (firstNamePronunciation || lastNamePronunciation) && (
            <LibraryRecordingsPresenter
              firstName={firstName}
              lastName={lastName}
              firstNamePronunciation={firstNamePronunciation}
              lastNamePronunciation={lastNamePronunciation}
              firstNamePending={firstNamePending}
              lastNamePending={lastNamePending}
              onFirstNameRecRequest={onFirstNameRecRequest}
              onLastNameRecRequest={onLastNameRecRequest}
            />
          )}

          {!loading && customAttributesDataPresent && (
            <CustomAttributesInspector
              data={currentPronunciation.customAttributes}
              pronunciation={currentPronunciation}
            />
          )}

          {!loading &&
            canComplexSearch &&
            !currentPronunciation &&
            !firstNamePronunciation &&
            !lastNamePronunciation && (
              <NameLinesResult
                controller={controller}
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
                permissions={permissions}
              />
            )}
        </Column>
      )}
    </>
  );
};

export default PronunciationsBlock;
