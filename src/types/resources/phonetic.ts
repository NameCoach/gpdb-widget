export default interface Phonetic {
  phoneticTranscription: string;
  phoneticsSystemSig?: string;
  workerSignature?: string;
  discussPhonetics: boolean;
  createdAt: Date;
}
