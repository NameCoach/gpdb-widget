import React, { useEffect, useRef, useState } from "react";
import NameLinesResult from "../../NamelinesResult";
import { NameOption } from "../../FullNamesList";
import Name, { NameTypes } from "../../../../types/resources/name";
import { AnalyticsEventType } from "../../../../types/resources/analytics-event-type";
import { usePronunciations } from "../../../hooks/pronunciations";
import useFeaturesManager from "../../../hooks/useFeaturesManager";
import { TermsAndConditions } from "../../../hooks/useRecorderState";
import IFrontController from "../../../../types/front-controller";
import { UserPermissions } from "../../../../types/permissions";
import useCustomFeatures from "../../../hooks/useCustomFeatures";
import { NameOwner } from "gpdb-api-client";
import nameToKeyTypeObjectsArray from "../../../../core/utils/name-to-key-type-objects-array";

interface Props {
  names: NameOption[];
  termsAndConditions?: TermsAndConditions;
  controller: IFrontController;
  permissions?: UserPermissions;
  onNamesLoaded: () => void;
}

const SearchResult = (props: Props): JSX.Element => {
  const customFeatures = useCustomFeatures(props.controller);

  const { can } = useFeaturesManager(
    props.controller.permissions,
    customFeatures,
    props.permissions
  );

  const {
    pronunciations,
    setPronunciations,
    updatePronunciationsByType,
  } = usePronunciations();

  const [loading, setLoading] = useState(false);
  const [nameParts, setNameParts] = useState<Name[]>([]);
  const [nameOwner, setNameOwner] = useState<NameOwner>(props.names[0].owner);

  const fullNamesObject = useRef([]);
  const nameParser = props.controller.nameParser;

  const canComplexSearch = can("pronunciation", "search");
  const canSearchBySig = can("pronunciation", "search_by_sig");

  const formNameParts = (names, result) => {
    const _names = names
      .map((name) => ({
        ...name,
        exist: result[name.type].length !== 0,
      }))
      .filter(
        (item) =>
          !(item.type === NameTypes.FullName && item.exist === false) ||
          names.length === 1
      );

    if (result.fullName.length > 0)
      return _names.filter((item) => item.type === NameTypes.FullName);

    return _names;
  };

  const searchBySig = async (name: NameOption): Promise<void> => {
    const nameOwner = { signature: name.value, email: name.value };
    const [names, result] = await props.controller.searchBySig(nameOwner);

    const fullName = names.find((n) => n.type === NameTypes.FullName);

    fullNamesObject.current =
      typeof fullName === "object"
        ? [{ key: name.key, value: fullName.key, owner: nameOwner }]
        : [name];

    const _nameParts = formNameParts(names, result);

    setNameParts(_nameParts);

    setPronunciations(result);
  };

  const sendAnalytics = (name: NameOption): PromiseLike<void> => {
    const names = nameToKeyTypeObjectsArray(name.value, nameParser);

    return props.controller.sendAnalytics(
      AnalyticsEventType.Available,
      Object.values(names)
    );
  };

  const complexSearch = async (name: NameOption): Promise<void> => {
    const names = nameToKeyTypeObjectsArray(name.value, nameParser);

    const result = await props.controller.complexSearch(names, name.owner);

    const _nameParts = formNameParts(names, result);

    setNameParts(_nameParts);

    setPronunciations(result);
  };

  const simpleSearch = async (name: NameOption): Promise<void> => {
    const names = nameToKeyTypeObjectsArray(name.value, nameParser);
    const fullName = names.find((name) => name.type === NameTypes.FullName);

    const pronunciations = await props.controller.simpleSearch(
      fullName,
      name.owner
    );

    const result = {
      fullName: pronunciations,
      firstName: [],
      lastName: [],
    };

    const _nameParts = formNameParts(names, result);

    setNameParts(_nameParts);

    setPronunciations(result);
  };

  const performSearch = async (name: NameOption): Promise<void> => {
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

  const loadName = async (name: NameOption): Promise<void> => {
    setLoading(true);

    setNameOwner(name.owner);

    await performSearch(name);

    setLoading(false);

    props.onNamesLoaded();
  };

  useEffect(() => {
    loadName(props.names[0]);
  }, [props.names]);

  return (
    <>
      {!loading && pronunciations && nameParts && (
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
    </>
  );
};

export default React.memo(SearchResult);
