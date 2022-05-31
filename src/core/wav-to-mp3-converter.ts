import IWavToMp3Converter, { Options } from "../types/wav-to-mp3-converter";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const lamejs = require("lamejs");

const defaultOptions: Options = {
  channels: 1,
  sampleRate: 48000,
  kbps: 128,
  sampleBlockSize: 1152,
};
const mp3MimeTypes = ["audio/mp3"];

export default class WavToMp3Converter implements IWavToMp3Converter {
  public file;
  public options;
  public mp3Blob;
  public mp3BlobUrl;
  private convertRequired;
  private mp3Encoder;

  constructor(options: Options = defaultOptions) {
    this.options = options;
  }

  public init(file: Blob): void {
    this.file = file;
    const { channels, sampleRate, kbps } = this.options;
    this.mp3Encoder = new lamejs.Mp3Encoder(channels, sampleRate, kbps);
    this.convertRequired = WavToMp3Converter.checkConvertRequired(this.file);

    if (!this.convertRequired) {
      this.mp3Blob = this.file;
      this.mp3BlobUrl = WavToMp3Converter.getBlobUrl(this.mp3Blob);
    }
  }

  private async readFileArrayBuffer(): Promise<ArrayBuffer> {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    return new Promise((resolve) => {
      fileReader.onload = (e): void => {
        const arrayBuffer = e.target.result as ArrayBuffer;
        resolve(arrayBuffer);
      };
    });
  }

  public async convert(): Promise<Blob> {
    if (!this.convertRequired) return this.mp3Blob;

    const buffer = await this.readFileArrayBuffer();
    const numberOfChannels = 1;

    const dataArray = new Int16Array(buffer);
    const monoDataArray = this.convertToMono(dataArray, numberOfChannels);
    this.mp3Blob = this.encode(monoDataArray);
    this.mp3BlobUrl = WavToMp3Converter.getBlobUrl(this.mp3Blob);

    return this.mp3Blob;
  }

  private encode(dataArray: Int16Array): Blob {
    const mp3Data = [];
    const { sampleBlockSize } = this.options;

    for (let i = 0; i < dataArray.length; i += sampleBlockSize) {
      const sample = dataArray.subarray(i, i + sampleBlockSize);
      const mp3Buf = this.mp3Encoder.encodeBuffer(sample);

      if (mp3Buf.length > 0) mp3Data.push(mp3Buf);
    }

    const mp3Ending = this.mp3Encoder.flush();

    if (mp3Ending.length > 0) mp3Data.push(new Int8Array(mp3Ending));

    return new Blob(mp3Data, { type: "audio/mp3" });
  }

  private convertToMono(dataArray, initialNumberOfChannels): Int16Array {
    if (initialNumberOfChannels < 2) return dataArray;

    return dataArray.filter(
      (e, index) => index % initialNumberOfChannels === 0
    );
  }

  private static checkConvertRequired(file: Blob): boolean {
    return !mp3MimeTypes.includes(file.type);
  }

  private static getBlobUrl(blob: Blob): string {
    return URL.createObjectURL(blob);
  }
}
