import React, { useEffect, useState } from "react";
import { Column, Row } from "../../../kit/Grid";
import { StyledText } from "../../../kit/Topography";
import Pronunciation from "../../../../types/resources/pronunciation";
import Select from "../../Select";
import { RequestButton } from "../../../kit/NewIconButtons/RequestButton";
import { Speaker } from "../../shared/components";

interface NameLineProps {
  name: string;
  pronunciation: Pronunciation;
  pronunciations: Pronunciation[];
  pending: boolean;
  onSelect: (pronunciation: Pronunciation) => any;
  onRecordingRequest: () => any;
}

export const NameLine = ({
  name,
  pronunciation,
  pronunciations,
  onSelect,
  pending,
  onRecordingRequest,
}: NameLineProps) => {
  const exist = pronunciations.length !== 0;
  const options = pronunciations.map((p) => ({
    value: p.id,
    label: p.language,
  }));
  const selectedOption = {
    value: pronunciation?.id,
    label: pronunciation?.language,
  };
  const [autoplay, setAutoplay] = useState<boolean>(false);
  const [recReqLoading, setRecReqLoading] = useState<boolean>(false);

  const _onRecordingRequest = async () => {
    setRecReqLoading(true);

    await onRecordingRequest().then(() => setRecReqLoading(false));
  };

  return (
    <Column gap={8}>
      <Row>
        <StyledText medium>{name}</StyledText>
      </Row>

      {exist ? (
        <Row gap={16}>
          <Select
            notFirstSelected
            onChange={(o) => {
              onSelect(pronunciations.find((p) => p.id === o.value));
              setAutoplay(true);
            }}
            options={options}
            value={selectedOption}
            filterOption={(o) => o.value !== selectedOption.value}
            styles={{
              container: {
                transition: "box-shadow 0.3s ease-in-out",
                width: "100%",
                boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.15)",
                borderRadius: "6px",
                backgroundColor: "#FFFFFF",
              },
            }}
          />
          <Speaker pronunciation={pronunciation} autoplay={autoplay} />
        </Row>
      ) : (
        <Row gap={16}>
          <StyledText small gray>
            {/* TODO: move to i18n */}
            {pending
              ? "Recording request pending"
              : "Pronunciation not available"}
          </StyledText>

          <RequestButton
            onClick={_onRecordingRequest}
            disabled={pending}
            loading={recReqLoading}
          />
        </Row>
      )}
    </Column>
  );
};
