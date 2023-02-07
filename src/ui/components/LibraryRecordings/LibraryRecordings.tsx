import React, { useCallback, useContext, useEffect, useState } from "react";
import { NameLine } from "./components";
import ControllerContext from "../../contexts/controller";
import { NameOwner } from "gpdb-api-client";
import Pronunciation, {
  AudioSource,
} from "../../../types/resources/pronunciation";
import { Row } from "../../kit/Grid";
import { StyledText } from "../../kit/Topography";
import { Button } from "../../kit/Buttons";
import { NameTypes } from "../../../types/resources/name";
import Loader from "../Loader";
import { Card } from "../../kit/Cards";
import { BinButton } from "../../kit/NewIconButtons";
import IFrontController from "../../../types/front-controller";
import { LibraryRecordingsProps } from "./types";

export const LibraryRecordings = ({
  owner,
  firstName,
  lastName,
  firstNamePronun,
  lastNamePronun,
  onFirstNameSelect,
  onLastNameSelect,
  onClose,
  onDelete,
  deleted,
}: LibraryRecordingsProps) => {
  const controller = useContext<IFrontController>(ControllerContext);

  const [fnPronuns, setFnPronuns] = useState<Pronunciation[]>([]);
  const [lnPronuns, setLnPronuns] = useState<Pronunciation[]>([]);
  const [fnRecReqPending, setFnRecReqPending] = useState<boolean>(false);
  const [lnRecReqPending, setLnRecReqPending] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const load = useCallback(async () => {
    const names = [
      { key: firstName, type: NameTypes.FirstName },
      { key: lastName, type: NameTypes.LastName },
    ];

    // search for pronunciations
    const result = await controller.complexSearch(names, owner);

    const _fnPronuns = result.firstName.filter(
      (p) => p.audioCreator === AudioSource.Gpdb
    );
    const _lnPronuns = result.lastName.filter(
      (p) => p.audioCreator === AudioSource.Gpdb
    );

    setFnPronuns(_fnPronuns);
    setLnPronuns(_lnPronuns);

    if (!firstNamePronun && _fnPronuns.length > 0) {
      onFirstNameSelect(_fnPronuns[0]);
    }
    if (!lastNamePronun && _lnPronuns.length > 0) {
      onLastNameSelect(_lnPronuns[0]);
    }

    // check for pending recording requests if no pronunciations found
    const requests = [];

    if (_fnPronuns.length === 0) {
      requests.push(
        controller
          .findRecordingRequest(firstName, NameTypes.FirstName, owner)
          .then((reqPending: boolean) => setFnRecReqPending(reqPending))
      );
    }
    if (_lnPronuns.length === 0) {
      requests.push(
        controller
          .findRecordingRequest(lastName, NameTypes.LastName, owner)
          .then((reqPending: boolean) => setLnRecReqPending(reqPending))
      );
    }

    await Promise.all(requests);

    setLoading(false);
  }, [firstName, lastName, owner, controller]);

  const onFnRecReq = async () => {
    return await controller
      .requestRecording(firstName, NameTypes.FirstName, owner)
      .then(() => setFnRecReqPending(true))
      .catch((e) => {
        console.log(e);
      });
  };

  const onLnRecReq = async () => {
    return await controller
      .requestRecording(lastName, NameTypes.LastName, owner)
      .then(() => setLnRecReqPending(true))
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    load();
  }, [load]);

  if (loading)
    return (
      <Card>
        <Loader />
      </Card>
    );

  return (
    <Card gap={18}>
      <Row>
        <Row>
          <StyledText small bold>
            {/* TODO: move to i18n */}
            Library recordings
          </StyledText>
        </Row>
        <Row right autoWidth flex={"0 0 auto"}>
          <BinButton disabled={deleted} onClick={onDelete} />
        </Row>
      </Row>

      <NameLine
        name={firstName}
        pronunciation={firstNamePronun}
        pronunciations={fnPronuns}
        onRecordingRequest={onFnRecReq}
        pending={fnRecReqPending}
        onSelect={(p) => {
          onFirstNameSelect(p);
        }}
      />

      <NameLine
        name={lastName}
        pronunciation={lastNamePronun}
        pronunciations={lnPronuns}
        onRecordingRequest={onLnRecReq}
        pending={lnRecReqPending}
        onSelect={(p) => {
          onLastNameSelect(p);
        }}
      />

      <Row padding={"10px 0 0 0"} centered gap={10}>
        <Button onClick={onClose}>
          {/* TODO: move to i18n */}
          Cancel
        </Button>
      </Row>
    </Card>
  );
};
