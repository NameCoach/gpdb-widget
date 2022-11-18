import { NameOwner } from "gpdb-api-client";
import Pronunciation from "../../../../types/resources/pronunciation";
import { TermsAndConditions } from "../../../hooks/useRecorderState";
import { InboundRelativeSource } from "./inbound-relative-source";
import { MachineSpec } from "./machine";
import { SampleRate } from "./sample-rate";

export interface RecorderViewProps {
  recorderProps: RecorderProps;
  sampleRateProps: SampleRateProps;
  uploaderProps: UploaderProps;
  termsAndConditionsProps: TermsAndConditionsProps;
  sliderProps: SliderProps;

  pronunciation?: Pronunciation;
  onDeletePronunciation: () => Promise<void>;
}

export interface DefaultViewProps extends RecorderViewProps {
  customAttributesProps: CustomAttributesProps;
  owner: NameOwner;
}

export interface OutlookViewProps extends RecorderViewProps {
  relativeSource: InboundRelativeSource;
}

interface SampleRateProps {
  onSampleRateSave: () => void;
  onDefaultSampleRateClick: () => void;
  onUpdateSampleRate: (val: number) => void;
  sampleRate: SampleRate;
  onSampleRateCancel: () => void;
}

interface RecorderProps {
  step: any;
  countdown: number;
  timer: number;

  onStart: () => void;
  onStop: () => Promise<void>;
  onSave: () => Promise<void>;

  handleOnRecorderClose: () => void;
  onRecorderClose: () => void;

  displaySaving: boolean;
  saving: boolean;

  showDeleteButton: boolean;
  showRecordButton: boolean;

  audioUrl: string;
  machineSpec: MachineSpec;
}

interface UploaderProps {
  onUploaderChange: (e: any) => void;
  fileSizeError: boolean;
}

interface TermsAndConditionsProps {
  termsAndConditions?: TermsAndConditions;
  onTermsAndConditionsAccept: () => Promise<void>;
}

interface SliderProps {
  closeSlider: () => void;
  slider: boolean;
  showSlider: boolean;
  openSlider: () => void;
}

interface CustomAttributesProps {
  onCustomAttributesSaved: () => void;
  onCustomAttributesBack: () => void;
}
