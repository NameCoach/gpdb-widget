import React, { useCallback, useContext, useEffect, useState } from "react";
import { NameLine } from "./components";
import IFrontController from "../../../types/front-controller";
import ControllerContext from "../../contexts/controller";
import { NameOwner } from "gpdb-api-client";
import Pronunciation, { AudioSource } from "../../../types/resources/pronunciation";
import { Container } from "./Container";
import { Row } from "../../kit/Grid";
import { StyledText } from "../../kit/Topography";
import { Button } from "../../kit/Buttons";
import { NameTypes } from "../../../types/resources/name";
import Loader from "../Loader";

interface LibraryRecordingsProps {
  firstName?: string;
  firstNamePronunciation?: Pronunciation;
  lastName?: string;
  lastNamePronunciation?: Pronunciation;
  owner: NameOwner;
  name: string;
  onCancel: () => any;
  onSaved: () => any;
  onDelete: () => any;
}

export const LibraryRecordings = ({
  firstName,
  firstNamePronunciation,
  lastName,
  lastNamePronunciation,
  owner,
  onCancel,
  onSaved,
  onDelete,
}: LibraryRecordingsProps) => {
  const controller = useContext<IFrontController>(ControllerContext);
  const [touched, setTouched] = useState<boolean>(false);

  const [fnPronuns, setFnPronuns] = useState<Pronunciation[]>([]);
  const [lnPronuns, setLnPronuns] = useState<Pronunciation[]>([]);
  const [fnPronun, setFnPronun] = useState<Pronunciation>(
    firstNamePronunciation
  );
  const [lnPronun, setLnPronun] = useState<Pronunciation>(
    lastNamePronunciation
  );
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

    const _fnPronuns = result.firstName.filter(p => p.audioCreator === AudioSource.Gpdb);
    const _lnPronuns = result.lastName.filter(p => p.audioCreator === AudioSource.Gpdb);

    setFnPronuns(_fnPronuns);
    setLnPronuns(_lnPronuns);

    if (!fnPronun && _fnPronuns.length > 0) {
      setFnPronun(_fnPronuns[0]);
      setTouched(true);
    }
    if (!lnPronun && _lnPronuns.length > 0) {
      setLnPronun(_lnPronuns[0]);
      setTouched(true);
    }

    // check for pending recording requests if no pronunciations found
    if (_fnPronuns.length === 0) {
      const _fnRecReq = await controller.findRecordingRequest(
        firstName,
        NameTypes.FirstName,
        owner
      );
      setFnRecReqPending(_fnRecReq);
    }
    if (_lnPronuns.length === 0) {
      const _lnRecReq = await controller.findRecordingRequest(
        lastName,
        NameTypes.LastName,
        owner
      );
      setLnRecReqPending(_lnRecReq);
    }

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
    if (!loading) return;

    load();
  }, [loading, load]);

  const onSave = () => {
    setLoading(true);

    controller
      .savePreferredRecordings({
        firstNamePronunciation: fnPronun,
        lastNamePronunciation: lnPronun,
      })
      .then(() => onSaved())
      .catch((e) => {
        console.log(e, e.details);
        setLoading(false);
      });
  };

  const _onDelete = () => {
    setLoading(true);
    
    controller
      .deletePreferredRecordings({
        firstNamePronunciation: fnPronun,
        lastNamePronunciation: lnPronun,
      })
      .then(() => {
        if (fnPronuns.length > 0) {
          setFnPronun(fnPronuns[0]);
          setTouched(true);
        }
        if (lnPronuns.length > 0) {
          setLnPronun(lnPronuns[0]);
          setTouched(true);
        }
        onDelete();
      })
      .catch((e) => {
        console.log(e, e.details);
        setLoading(false);
      });
  };

  if (loading)
    return (
      <Container>
        <Loader />
      </Container>
    );

  return (
    <Container gap={18}>
      <Row>
        <StyledText small bold>
          {/* TODO: move to i18n */}
          Library recordings
        </StyledText>
      </Row>

      <NameLine
        name={firstName}
        pronunciation={fnPronun}
        pronunciations={fnPronuns}
        onRecordingRequest={onFnRecReq}
        pending={fnRecReqPending}
        onSelect={(p) => {
          setTouched(true);
          setFnPronun(p);
        }}
      />

      <NameLine
        name={lastName}
        pronunciation={lnPronun}
        pronunciations={lnPronuns}
        onRecordingRequest={onLnRecReq}
        pending={lnRecReqPending}
        onSelect={(p) => {
          setTouched(true);
          setLnPronun(p);
        }}
      />

      <Row padding={"10px 0"} centered gap={10}>
        <Button onClick={onCancel}>
          {/* TODO: move to i18n */}
          Cancel
        </Button>

        {touched && (
          <Button primary onClick={onSave}>
            {/* TODO: move to i18n */}
            Save
          </Button>
        )}
        {!touched && (firstNamePronunciation || lastNamePronunciation) && (
          <Button danger onClick={_onDelete}>
            {/* TODO: move to i18n */}
            Delete
          </Button>
        )}
      </Row>
    </Container>
  );
};
