import Pronunciation, {
  AudioSource,
} from "../../types/resources/pronunciation";

const pronunciationMap: Mapper<Pronunciation> = (raw) => ({
  id: raw.id,
  audioSrc: raw.audio_url,
  nameOwnerCreated: raw.audio_source === AudioSource.NameOwner,
  language:
    raw.language_metadata?.origin_language?.[0]?.language ||
    raw.language_metadata?.speaker_language,
  phoneticSpelling: raw.phonetic_transcriptions[0]?.phonetic_transcription,
  userResponse: {
    id: raw.user_responses?.[0]?.response_id,
    response: raw.user_responses?.[0]?.user_response,
  },
  customAttributes: raw.custom_attributes,
  phoneticTranscriptions:
    (raw.phonetic_transcriptions &&
      raw.phonetic_transcriptions.map((transcriptions) => ({
        phoneticTranscription: transcriptions.phonetic_transcription,
        phoneticsSystemSig: transcriptions.phonetics_system_sig,
        workerSignature: transcriptions.worker_signature,
        discussPhonetics: transcriptions.discuss_phonetics,
        createdAt: new Date(transcriptions.created_at),
      }))) ||
    [],
});

export default pronunciationMap;
