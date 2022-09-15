import { RelativeSource } from "../../types/resources/pronunciation";
import { InboundRelativeSource } from "../../ui/components/Recorder/types/inbound-relative-source";

export const getRecordStateTitleText = (
  relativeSource: InboundRelativeSource,
  name?: string
): string => {
  if (name) return `Pronounce "${name}"`;

  if (relativeSource === RelativeSource.RequesterSelf)
    return "Pronounce your name";

  return "Recording...";
};
