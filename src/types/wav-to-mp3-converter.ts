type IWavToMp3Converter = {
  file: Blob;
  options: Options;
  mp3Blob: Blob;
  mp3BlobUrl: string;
  init: (file: Blob) => void;
  convert: () => PromiseLike<Blob>;
};

export type Options = {
  channels: number;
  sampleRate: number;
  kbps: number;
  sampleBlockSize: number;
};

export default IWavToMp3Converter;
