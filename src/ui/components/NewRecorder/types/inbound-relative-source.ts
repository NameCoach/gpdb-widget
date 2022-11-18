import { RelativeSource } from "../../../../types/resources/pronunciation";

export type InboundRelativeSource =
  | RelativeSource.RequesterSelf
  | RelativeSource.RequesterPeer;
